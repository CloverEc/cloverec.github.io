import { Component } from '@angular/core';
import {IonicPage, NavController, Platform,NavParams } from 'ionic-angular';
import {LoadingController } from 'ionic-angular'; 
import {ApiService} from '../../providers/api-service'
import {App } from 'ionic-angular'; 
import {AlertController,MenuController  } from 'ionic-angular';
import {Storage } from '@ionic/storage'
import {Events } from 'ionic-angular'

/**
 * Generated class for the SignUp page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
  providers: [ApiService]
})
export class SignUp {
  signUp: string = "phone";
  sms_button_text: string
  sms_disabled: boolean
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public app: App,
    private apiServece: ApiService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public events: Events,
    public storage: Storage

  ) {
     this.sms_button_text = "SMSコード発行"
     this.sms_disabled = false
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUp');
  }

  openMenu() {
    this.menuCtrl.open();
  }

    // /api/sms_verify/new?phone=13818539773
  sendSMS(phone){
    if(!phone){
      let alert = this.alertCtrl.create({
        subTitle: "番号が正しくありません",
        buttons: ['OK']
      });
      alert.present();
      return false
    }
    let loader = this.loadingCtrl.create({
      content: "お待ちください"
    });
    loader.present();
    this.apiServece.getData("/api/sms_verify/new?phone=" + phone).subscribe(data => {
      this.smsButtonTimeout(100);
      loader.dismiss();
    }, err=>{
      loader.dismiss();
      let data = JSON.parse(err._body)
      let alert = this.alertCtrl.create({
        subTitle: data.error,
        buttons: ['OK']
      });
      alert.present();
      console.error(err)
    })
  }

  smsButtonTimeout(sec:number):void{
    this.sms_button_text = sec+"S";
    this.sms_disabled = true;

    if(sec<=0){
      this.sms_disabled = false;
      this.sms_button_text = "再発行";
    }else{
      setTimeout(() => {
        this.smsButtonTimeout(sec-1);
      }, 1000);
    }
  }

  onSingUp(phone,verify,password){ 
    let loader = this.loadingCtrl.create({
      content: "読み込み中..",
    });
    loader.present();

    this.apiServece.postPromise("/api/accounts",{phone: phone,verify: verify,password: password}).then(resp => {
      console.log(resp)
      let alert = this.alertCtrl.create({
        subTitle: "ありがとうございます。送信に成功しました",
        buttons: ['OK']
      });
      alert.present();
      loader.dismiss();
      this.events.publish('user:changed', "signUp");
      loader.dismiss();
      this.menuCtrl.open();
    }).catch(err => {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        subTitle: err,
        buttons: ['OK']
      });
      alert.present();
      console.log("ya")
    })
  }

  onSineUpEmail(email,password){
    let loader = this.loadingCtrl.create({
      content: "読み込み中..",
    });
    loader.present();

    this.apiServece.postPromise("/api/accounts",{email: email,password: password}).then(resp => {
      console.log(resp)
      let alert = this.alertCtrl.create({
        subTitle: "ありがとうございます。送信に成功しました",
        buttons: ['OK']
      });
      alert.present();
      loader.dismiss();
      this.events.publish('user:changed', "signUp");
      loader.dismiss();
      this.menuCtrl.open();
    }).catch(err => {
      console.log(err)
      let message = JSON.parse(err._body)
      loader.dismiss();
      let alert = this.alertCtrl.create({
        subTitle: message.error,
        buttons: ['OK']
      });
      alert.present();
    })
  }
}
