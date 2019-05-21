import { Component } from '@angular/core';
import { ApiService} from '../../providers/api-service'
import { NavController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-sms',
  providers: [ApiService],
  templateUrl: 'sms.html'
})
export class Sms {
  public sms_disabled: boolean
  public sms_button_text: string = "获取验证码"

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private apiServece: ApiService
  ) {
  }

  submit() {
  }

  smsAuth(mobileNum) {
    // let loader = this.loadingCtrl.create({      
    //   content: "请稍后..."     
    // });       
    //
    // loader.present();
    //
    // this.apiService.saveAnonymousPromise("account/getValidateCode", {mobile: mobile,type: "register"}).then(data=>{                 
    //   this.smsButtonTimeout(100);                                                                                                   
    //   loader.dismiss();                                                                                                             
    // }) 
    //   .catch(err=>{ 
    //     this.alertCtrl.create({                                                                                                     
    //       title: '消息',                                                                                                          
    //       subTitle: err.message,                                                                                                  
    //       buttons: ['OK']                                                                                                         
    //     }).present();                                                                                                             
    //     loader.dismiss();                                                                                                           
    //   });
  }
}
