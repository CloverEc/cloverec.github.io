import {Component,ViewChild} from '@angular/core';
import {Events, Nav, Platform,NavController,AlertController,MenuController,LoadingController } from 'ionic-angular'; 
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen'; 
import {Storage} from '@ionic/storage'; 
import {TabsPage} from '../pages/tabs/tabs';
import {TutorialPage} from '../pages/tutorial/tutorial'; 
import {User} from '../pages/user/user'; 
import {UsersPage} from '../pages/users/users'; 
import {Login} from '../pages/login/login'; 
import {HomePage} from '../pages/home/home'; 
import {Shops} from '../pages/shops/shops'; 
import {Shop} from '../pages/shop/shop'; 
import {Topics} from '../pages/topics/topics'; 
import {Setting} from '../pages/setting/setting'; 
import {ApiService} from '../providers/api-service';
import {PhotoViewerPage} from '../pages/photo-viewer/photo-viewer';
import {Evaluates} from '../pages/evaluates/evaluates'
import {Push, PushObject, PushOptions} from "@ionic-native/push";
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  templateUrl: 'app.html',
  providers: [ApiService]
})
export class MyApp {
  rootPage: any;
  pushPage: any;
  @ViewChild(Nav) nav: Nav;
  public user: {avatar?:string,name?:string} = {};
  public isLogin:boolean　
  public token:string = ""
  public uid:number
  public dateTime: any
  public uuid:string
  public userData: any = {}
  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public events: Events,
    public storage: Storage,
    private ga: GoogleAnalytics,
    public push: Push,
    private apiServece: ApiService,
    private geolocation: Geolocation,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private statusBar: StatusBar) {
    this.ga.startTrackerWithId('UA-107037855-1')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('test');
        }).catch(e => console.log('Error starting GoogleAnalytics', e));


    this.user.avatar = "assets/images/blank_user.png"
    var date = new Date() 
    this.dateTime =  date.getTime()
    platform.ready().then(() => {
      setTimeout(()=>{
        this.splashScreen.hide();
      },500)
    });
    let view:any
    setTimeout(()=>{
      view = this.nav.getActive()
    })
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          if (view){
            //|Topic|Campaign|Classified
            if (view.component.name){
              console.log(view.component)
              // this.nav.setRoot(Shops)
            }
          }else{
            this.nav.setRoot(TabsPage)
          }
        } else {
          //this.rootPage = TutorialPage;
          if (view){
            //|Topic|Campaign|Classified
            if (view.component.name){
              console.log(view.component)
              // this.nav.setRoot(Shops)
            }
          }else{
            this.nav.setRoot(TabsPage)
          }
        }
        platform.ready().then(() => {
          setTimeout(()=>{
            this.splashScreen.hide();
            this.geolocation.getCurrentPosition().then(pos => {
              this.storage.set('lat',pos.coords.latitude)
              this.storage.set('lng',pos.coords.longitude)
            })
          },100)
          if (this.platform.is('ios')) {
            // this.initPushNotification()
            }
          this.statusBar.overlaysWebView(true)
          this.statusBar.styleDefault()
        });
      });
    this.readStorage()
    this.events.subscribe('user:changed',data => {
    var date = new Date() ;
    this.dateTime =  date.getTime()
    this.readStorage()
      if (data != "logout"){
        let loader = this.loadingCtrl.create({
          content: "読み込み中..",
        });
        setTimeout(() => {
          if (this.checkLogin()){
            console.log("user changed!")
            this.isLogin = true
            this.menuCtrl.open();
            loader.dismiss();
          }
        },100)
      }else{
        console.log("yes logout!")
        this.isLogin = false
      }
    })

    this.events.subscribe('bookmark_count:changed', (data) => {
      console.log(data)
      if (data.type == "shops" && this.userData.shops_cnt) {
        this.userData.shops_cnt = (Number(this.userData.shops_cnt) + data.count)
      }
      if (data.type == "topics" && this.userData.topics_cnt) {
        this.userData.topics_cnt = (Number(this.userData.topics_cnt) + data.count)
      }
      if (data.type == "users" && this.userData.users_cnt) {
        this.userData.users_cnt = (Number(this.userData.users_cnt) + data.count)
      }
      if (data.type == "users" && this.userData.users_cnt) {
        this.userData.users_cnt = (Number(this.userData.users_cnt) + data.count)
      }
      if (data.type == "evaluate"){
        setTimeout(()=>{
          this.checkLogin()
        },300)
      }
    })

    this.events.subscribe('wechat_user:changed',(data) => {
      let wechat = data
      let loader = this.loadingCtrl.create({
        content: "読み込み中..",
      });
      loader.present();
      let params:any = {}
      let url:string  =  ""
      let version:string = ""
      url = "/api/bind_wechat_user"
      if(window.localStorage.getItem("code")){
        // let loader = this.loadingCtrl.create({
        //   content: "読み込み中..",
        // });
        // loader.present();
        setTimeout(()=>{
          this.readStorage()
        },0)
        setTimeout(() => {
          // alert(window.localStorage.getItem("code"))
          this.apiServece.postWeixinData(
              "/api/weixin",
              JSON.stringify({code: window.localStorage.getItem("code")})
          ).subscribe(data => {
              setTimeout(() => {
                if (wechat === "uid"){
                  version = 'application/vnd.zine-v2'
                  params = { 
                    avatar:   data.response.avatar, 
                    openid:   data.response.openid, 
                    city:     data.response.city, 
                    nickname: data.response.nickname, 
                    country:  data.response.country, 
                    current: 1,
                    sex: data.response.sex,
                    province: data.response.province
                  }
                }else {
                  version = 'application/vnd.zine-v1'
                  params = { 
                    avatar: data.response.avatar,
                    openid: data.response.openid,
                    city: data.response.city,
                    nickname: data.response.nickname,
                    country:  data.response.country,
                    sex:    data.response.sex,
                    province: data.response.province
                  }
                }
                // postData(url:string,params?:any, md5?:string, token?:string): Observable<any>{
                this.token = null
                this.apiServece.postData(url,params,this.uuid,this.token,version)
                  .subscribe(data => {
                    loader.dismiss();
                    console.error("++++++++++++++++++++++++++++++++++++++++++++++")
                    console.error("hello")
                    console.error("++++++++++++++++++++++++++++++++++++++++++++++")
                    let id  = data.data.id
                    let token = data.data.mobile_token
                    this.uid = id
                    this.token = token
                    this.storage.set('uid',this.uid)
                    this.storage.set('token',this.token)
                    this.apiServece.setLogin(true)
                    this.menuCtrl.open();
                    this.nav.setRoot(TabsPage)
                    this.isLogin = true
                    this.checkLogin()
                    window.localStorage.setItem("code",null)
                  },err=>{
                    console.error("++++++++++++++++++++++++++++++++++++++++++++++")
                    console.error(err)
                    console.error("++++++++++++++++++++++++++++++++++++++++++++++")
                    if (err._body){
                      let msg:any = JSON.parse(err._body)
                      // alert(err)
                      loader.dismiss();
                      this.alertCtrl.create({
                        subTitle: msg,
                        buttons: ['OK']
                      }).present();
                    }
                  })
              },1)
            }, err=>{
              alert(err)
              loader.dismiss();
              console.error(err)
            })
        },1)
        // setTimeout(()=>{
        //   loader.dismiss();
        // },8000)
      }
    })
  }

  onLogin(){
    setTimeout(()=>{
      this.nav.setRoot(Login,{menu: true})
      // this.navCtrl.push(Login,{menu: true})
    },100)
  }
  
  onLogout(){
    setTimeout(()=>{
      this.user = {}
      this.storage.set('uid',null)
      this.storage.set('token',null)
      this.apiServece.setLogin(false)
      this.nav.setRoot(Login,{logout: true,menu: true})
    },100)
  }
  
  home(){
    setTimeout(()=>{
      // this.nav.rootPage = TabsPage
      this.nav.setRoot(TabsPage)
    },100)
  }

  editUser(){
    setTimeout(()=>{
      if(this.isLogin){
        this.nav.setRoot(User)
      }
    },100)
  }
  setting(){
    setTimeout(()=>{
      this.nav.setRoot(Setting)
    },100)
  }

  openUsers(){
    setTimeout(()=>{
      this.nav.setRoot(UsersPage)
    },100)
  }

  openShops(i){
    setTimeout(()=>{
      this.nav.setRoot(Shops,{isMember: true, currentUser: this.userData})
    },100)
  }
  
  openTopics(i){
    setTimeout(()=>{
      this.nav.setRoot(Topics,{isMember: true, currentUser: this.userData})
    },100)
  }
  openPhotoViewe(i){
    setTimeout(()=>{
      this.nav.setRoot(PhotoViewerPage,{type: "user",uid: i})
    },100)
  }
  openEvaluates(i){
    setTimeout(()=>{
      this.nav.setRoot(Evaluates,{type: "user",uid: i})
    },100)
  
  }

  checkLogin(){
    this.apiServece.getData("/api/members/new?id=" + this.uid, this.uuid, this.token)
      .subscribe(data => {
        if (data.code == 200){
          this.isLogin = data.data.logined
          this.apiServece.setLogin(data.data.logined)
          if (this.isLogin) {
            this.apiServece.getData("/api/members/" + this.uid, this.uuid, this.token).subscribe(resp => {
              this.user = resp.data
              this.storage.set("name",this.user.name)
            })
            this.apiServece.getData("/api/members/" + this.uid + '/sns_stat', this.uuid, this.token).subscribe(data => {
              this.userData.evaluate_images_cnt  = data.data[0].evaluate_images
              this.userData.evaluates_cnt  =  data.data[0].evaluates
              this.userData.shops_cnt = data.data[0].shops
              this.userData.topics_cnt = data.data[0].topics
              this.userData.users_cnt = data.data[0].users
            }, err=>{
              console.error(err)
            })
          }
        }else{
          return false
        }
      }, err=>{
        console.error(err)
        return false
      });
  }

  readStorage(){
    setTimeout(()=>{
      this.storage.get('uuid').then((value)=>{
        if (value){
          this.uuid = value
        }else{
          let guid:string = 'xxxxxxxxxxxxxxxxxxxxyxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
          });
          this.storage.set("uuid",guid)
        }
      })
      this.storage.get('token')
        .then((value) => {
          if (value){
            this.token = value
              this.storage.get('uid')
                .then((value) => {
                 if (value){
                    this.uid = value
                    this.checkLogin()
                  }
           });
          }
        });
    },0)
  }

  // initPushNotification() {
  //   // to check if we have permission
  //   if (this.platform.is('ios')) {
  //     this.push.hasPermission()
  //       .then((res: any) => {
  //         if (res.isEnabled) {
  //           console.log('We have permission to send push notifications');
  //         } else {
  //           console.log('We do not have permission to send push notifications');
  //         }
  //
  //       });
  //
  //       // to initialize push notifications
  //
  //       const options: PushOptions = {
  //         android: {
  //           senderID: '12345679'
  //         },
  //         ios: {
  //           alert: 'true',
  //           badge: true,
  //           sound: 'false',
  //           clearBadge: true
  //         },
  //         windows: {}
  //       };
  //
  //       const pushObject: PushObject = this.push.init(options);
  //
  //       pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
  //       pushObject.on('registration').subscribe((registration: any) => {
  //         console.log('Device registered', JSON.stringify(registration))
  //         console.error(JSON.stringify(registration))
  //
  //         if (this.platform.is('ios')) {
  //           setTimeout(()=>{
  //             this.storage.get('ios_registration_id').then((value)=>{
  //               if (!value){
  //                 this.apiServece.postData(
  //                   "/api/endpoint",
  //                   JSON.stringify({registration_id: registration.registrationId})
  //                 ).subscribe(data => {
  //                   this.storage.set("ios_registration_id", registration.registrationId)
  //                 }, err=>{
  //                   console.error(err)
  //                 })
  //               }
  //             })
  //           },0)
  //         }
  //       });
  //       pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  //
  //   }
//  }
}

