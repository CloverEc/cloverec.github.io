import {Component } from '@angular/core';
import {IonicPage, NavController, Platform,NavParams } from 'ionic-angular';
import {LoadingController } from 'ionic-angular'; 
import {ApiService} from '../../providers/api-service'
import {App } from 'ionic-angular'; 
import {AlertController,MenuController  } from 'ionic-angular';
import {Storage } from '@ionic/storage'
import {TabsPage } from '../tabs/tabs';
import {SignUp} from '../sign-up/sign-up';
import {PhotoViewerPage} from '../photo-viewer/photo-viewer'
import {Events } from 'ionic-angular'
import CryptoJS from 'crypto-js';
import { InAppBrowser } from '@ionic-native/in-app-browser'; 
declare let Wechat: any
// declare var cordova;
// declare var window;
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ApiService]
})
export class Login {
  login: {username?: string, password?: string} = {};
  isApp:boolean = false
  logo:string
  weixin_logo:string
  submitted = false;
  code:string
  uuid:string
  private CryptoJS: any;
  SECERET_KEY: string = 'asjdfhlayczkjha';
  // userChanged = new EventEmitter();
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public platform: Platform,
    public events: Events,
    public app: App,
    private apiServece: ApiService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private iab: InAppBrowser,
    public storage: Storage
  ) {
    setTimeout(()=>{
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp = false
      }else{
        this.isApp = true
      }
    })
    this.logo = "assets/images/logo.svg"
    this.weixin_logo = "assets/images/wechat.svg"
    this.code = ""
    this.uuid = ""
    setTimeout(()=>{
        if (navParams.get("logout")){
          console.log("logout!") 
          this.events.publish('user:changed', "logout");
        }
        this.storage.get('uuid').then((value)=>{
          if (value){
            this.uuid = value }
        })
        this.storage.get('username').then((value)=>{
          if (value){
            let decodeUsername = CryptoJS.AES.decrypt(value,this.SECERET_KEY)
            console.log(decodeUsername.toString(CryptoJS.enc.Utf8))
            this.login.username = decodeUsername.toString(CryptoJS.enc.Utf8)
          }
        })
        this.storage.get('password').then((value)=>{
          if (value){
            let decodePassword = CryptoJS.AES.decrypt(value,this.SECERET_KEY)
            this.login.password = decodePassword.toString(CryptoJS.enc.Utf8)
          }
        })
    },1)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  onLogin(username,password){
    if (!username){
      let alert = this.alertCtrl.create({
        subTitle: "ユーザを入力してください",
        buttons: ['OK']
      });
      alert.present();
      return false
    }
    if (!password){
      let alert = this.alertCtrl.create({
        subTitle: "パスワードを入力してください",
        buttons: ['OK']
      });
      alert.present();
      return false
    }
    setTimeout(() => {
      let loader = this.loadingCtrl.create({
        content: "読み込み中..",
      });
      loader.present();
      this.apiServece.postData("/api/members", JSON.stringify({account: username,password: password}),this.uuid)
        .subscribe(data => {
            this.storage.set("token", data.data.mobile_token);
            this.storage.set("uid", data.data.id);
            let cipherUsername = CryptoJS.AES.encrypt(username, this.SECERET_KEY);
            let cipherPassword = CryptoJS.AES.encrypt(password, this.SECERET_KEY);
            this.storage.set("username", cipherUsername.toString());
            this.storage.set("password", cipherPassword.toString());
            this.events.publish('user:changed', data);
            this.apiServece.setLogin(true)
            loader.dismiss();
            this.menuCtrl.open();
            if (this.navParams.get("menu")){
              this.app.getRootNav().setRoot(TabsPage) 
            }else{
              this.navCtrl.pop()
            }

        }, err=>{
          let message =  JSON.parse(err._body)
          let alert = this.alertCtrl.create({
            subTitle: message.error,
            buttons: ['OK']
          });
          alert.present();
          loader.dismiss();
        })
    },100)
  
  }

  onSignup(){
    this.app.getRootNav().setRoot(SignUp) 
  }

  onForgotPassword(){
    const browser = this.iab.create('http://shanghai-zine.com/?password_reminder=1', '_blank', 'location=yes');
    // browser.show()
  }

  onWeixinLogin(){
    let l = this.loadingCtrl.create({
      content: "読み込み中..",
    });
    l.present();
    this.storage.set("token",null)
    setTimeout(()=>{
      l.dismiss();
      this.events.publish('wechat_user:changed', "changed");
      // this.app.getRootNav().setRoot(TabsPage)
    },7000)
    var scope = "snsapi_userinfo", state = "_" + (+new Date());
    Wechat.auth(scope, state, function (response) {
      window.localStorage.setItem("code",response.code)
    }, function (reason) {
        console.log("Failed: " + reason);
    })
  }
}
