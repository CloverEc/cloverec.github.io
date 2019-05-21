import { Component } from '@angular/core';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'; 

@Component({
  selector: 'page-bind-mobile',
  providers: [ApiService, Utils],
  templateUrl: 'bind-mobile.html'
})
export class BindMobile {
  public sms_disabled: boolean
  public sms_button_text: string = "SMSコード発行"
  public token: string
  public uuid: string
  public telphone: string
  public phoneVerify: string

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    private apiService: ApiService,
    private utils: Utils
  ) {
    this.storage.get("token").then((val) => {
      this.token = val
    })
    this.storage.get("uuid").then((val) => {
      this.uuid = val
    })
  }

  onSave() {
    if(!this.telphone){
      this.alertCtrl.create({
        subTitle: "phone err",
        buttons: ['OK']
      }).present();
      return false
    }
    if(!this.phoneVerify){
      this.alertCtrl.create({
        subTitle: "captcha err",
        buttons: ['OK']
      }).present();
      return false
    }
    let loader = this.loadingCtrl.create();
    loader.present();
    this.apiService.putData("/api/members", this.uuid, this.token, {telphone: this.telphone, phone_verify: this.phoneVerify}).subscribe(resp => {
      loader.dismiss();
      let alert  = this.alertCtrl.create({
        subTitle: "submit success",
        buttons: ['OK']
      })
      alert.present();
      alert.onDidDismiss(data => {
        this.navCtrl.pop()
        this.navParams.data.currentUser.phone = this.telphone
      })
    }, err => {
      this.utils.forHttp(err)
      loader.dismiss();                                                                                                           
    });
  }

  smsAuth(mobileNum) {
    if(!mobileNum){
      let alert = this.alertCtrl.create({
        subTitle: "番号が正しくありません",
        buttons: ['OK']
      });
      alert.present();
      return false
    }
    let loader = this.loadingCtrl.create();
    loader.present();
    this.apiService.getData("/api/verify/new?type=phone&phone="+mobileNum, this.uuid, this.token).subscribe(resp => {
      this.smsButtonTimeout(100);                                                                                                   
      loader.dismiss();                                                                                                             
    }, err => {
      let msg = "Unknow ERR"
      if (err._body) {
        msg = JSON.parse(err._body).error
      }
      this.alertCtrl.create({                                                                                                     
        subTitle: msg,                                                                                                  
        buttons: ['OK']                                                                                                         
      }).present();                                                                                                             
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
