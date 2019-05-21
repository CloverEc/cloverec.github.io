import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiService} from '../../providers/api-service'
import {LoadingController } from 'ionic-angular'; 
import {AlertController,MenuController  } from 'ionic-angular';
import { Shop } from '../shop/shop'; 
/**
 * Generated class for the CorrectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-correction',
  providers: [ApiService],
  templateUrl: 'correction.html',
})
export class CorrectionPage {
  close: boolean
  message: string
  shop_id: number 

  constructor(
    public apiServece: ApiService,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.shop_id  = this.navParams.get("shop_id")
    console.log(this.shop_id)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CorrectionPage');
  }

  sendCorrection(message,close){
    let loader = this.loadingCtrl.create({
      content: "読み込み中..",
    });
    loader.present();
    console.log(message)
    if (!message){
      let alert = this.alertCtrl.create({
        subTitle: "ご意見、ご提案などを入力ください",
        buttons: ['確定']
      });
      alert.present();
    }
    console.log(this.shop_id)
    let c = 0
    if (close){
      c = 1
    }
    this.apiServece.postPromise("/api/support/reports",
      { content: message,
        closed: c,
        shop_id:  this.shop_id
      }).then(resp => { 
      console.log(resp) 
      let alert = this.alertCtrl.create(
        { subTitle: "ありがとうございます。送信に成功しました",
          buttons: ['OK']
      });
      alert.present();
      loader.dismiss();
      this.navCtrl.pop()
      // this.navCtrl.push(Shop,{shop_id: this.shop_id})
    }).catch(err => {
      console.log(err)
      let alert = this.alertCtrl.create({
        subTitle: err,
        buttons: ['OK']
      });
      alert.present();
      loader.dismiss();
    })
  }
}
