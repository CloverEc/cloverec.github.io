// Setup basic express server
var server = require('http').createServer();
var io = require('socket.io')(server);
var someConfigs = require('./config').SomeConfigs();
var port = process.env.PORT || someConfigs.webSocketPort;

var redis = require('redis');
var sub = redis.createClient(someConfigs.redisPort, {db: someConfigs.redisDb});

// sub.on("subscribe", function (channel, count) {
// });

sub.on("message", function (channel, message) {

    console.log("sub channel " + channel + ": " + message);
    if (channel == "facebook_channel") {
        console.log(JSON.parse(message));
        var msg = JSON.parse(message);
        var userKey = "user_" + msg.user._id.$oid;
        // if (io.sockets.adapter.rooms[userKey] == undefined) {
        //   io.sockets.in("admin").emit("bot", msg);
        // } else {
        //   io.sockets.in(userKey).emit("chat", msg);
        // }
        io.sockets.in("admin").emit("chat", msg);
    }
    if (channel == "set_admin") {
        var user = JSON.parse(message);
        io.sockets.in("admin").emit("set_admin", user);
    }

    if (channel == "update_admin") {
        var user = JSON.parse(message);
        io.sockets.in("admin").emit("update_admin", user);
    }

    if (channel == "all_managers") {
        var msg = JSON.parse(message);
        io.sockets.in("admin").emit("all_managers", msg);
    }
});

sub.subscribe("facebook_channel");
sub.subscribe("set_admin");
sub.subscribe("update_admin");
sub.subscribe("all_managers");

io.set('heartbeat interval', 10 * 1000);
io.set('heartbeat timeout', 13 * 1000);

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
// app.use(express.static(__dirname + '/public'));
// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
    var addedUser = false;
    console.info("clientsCount:  " + io.eio.clientsCount);
    socket.emit("connection", {});
    socket.on('join_admin', function (data) {
        // console.log(data);
        socket.admin_id = data.$oid;
        socket.admin_name = data.login_name;
        socket.fid = data.fid;
        socket.join("admin");
        var arr = [];
        for (id in socket.adapter.rooms["admin"].sockets) {
            st = socket.nsp.connected[id];
            arr.push({admin_name: st.admin_name, admin_id: st.admin_id});
        }
        socket.emit("join_admin", arr);
        // io.sockets.in("admin").emit("online", [{admin_name: socket.admin_name, admin_id: socket.admin_id}]);
        socket.to("admin").emit("online", {admin_name: socket.admin_name, admin_id: socket.admin_id});
    });

    socket.on('to_join', function (data) {
        var userKey = "user_" + data.user_id;
        // if (socket.adapter.rooms[userKey] == undefined) {
        //   socket.join(userKey);
        //   socket.emit("resp_join", {user_id: data.user_id, result: 1});
        //   io.sockets.in("admin").emit("cancel_link", {user_id: data.user_id});
        // } else {
        //   socket.emit("resp_join", {result: 0});
        // }
        socket.join(userKey);
        socket.emit("resp_join", {user_id: data.user_id, result: 1});
        io.sockets.in("admin").emit("cancel_link", {user_id: data.user_id});
        console.log(io.sockets.adapter.rooms);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        console.log("disconnect");
        io.sockets.in("admin").emit("offline", {admin_id: socket.admin_id});
        // if (addedUser) {
        //   --numUsers;
        //   if (matchId != 0) {
        //     io.sockets.in("match_"+matchId).emit("offline", {user_id: socket.user_id});
        //   }
        // }
    });
});
