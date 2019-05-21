import { Component } from '@angular/core';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'; 

@Component({
  selector: 'page-bind-email',
  providers: [ApiService, Utils],
  templateUrl: 'bind-email.html'
})
export class BindEmail {
  public sms_disabled: boolean
  public sms_button_text: string = "获取验证码"
  public token: string
  public uuid: string
  public email: string
  public captcha: string

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public storage: Storage,
    private utils: Utils,
    private apiService: ApiService
  ) {
    this.storage.get("token").then((val) => {
      this.token = val
    })
    this.storage.get("uuid").then((val) => {
      this.uuid = val
    })
  }

  onSave() {
    if(!this.email){
      this.alertCtrl.create({
        subTitle: "email err",
        buttons: ['OK']
      }).present();
      return false
    }
    if(!this.captcha){
      this.alertCtrl.create({
        subTitle: "captcha err",
        buttons: ['OK']
      }).present();
      return false
    }
    let loader = this.loadingCtrl.create();
    loader.present();
    this.apiService.putData("/api/members", this.uuid, this.token, {email: this.email, email_verify: this.captcha}).subscribe(resp => {
      loader.dismiss();
      let alert  = this.alertCtrl.create({
        subTitle: "submit success",
        buttons: ['OK']
      })
      alert.present();
      alert.onDidDismiss(data => {
        this.navCtrl.pop()
        this.navParams.data.currentUser.email = this.email
      })
    }, err => {
      this.utils.forHttp(err)
      loader.dismiss();                                                                                                           
    });
  }

  smsAuth(email) {
    if(!email){
      let alert = this.alertCtrl.create({
        subTitle: "email err",
        buttons: ['OK']
      });
      alert.present();
      return false
    }
    let loader = this.loadingCtrl.create();
    loader.present();
    this.apiService.getData("/api/verify/new?type=email&email="+email, this.uuid, this.token).subscribe(resp =>{                 
      this.smsButtonTimeout(100);                                                                                                   
      loader.dismiss();                                                                                                             
    }, err => {
      this.utils.forHttp(err)
      loader.dismiss();                                                                                                           
    });
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
}
