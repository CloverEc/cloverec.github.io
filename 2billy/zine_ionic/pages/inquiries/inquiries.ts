import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import {Storage} from '@ionic/storage'; 
import {LoadingController } from 'ionic-angular'; 
import {AlertController,MenuController  } from 'ionic-angular';
import {Setting} from '../setting/setting'; 
/**
 * Generated class for the Inquiries page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inquiries',
  templateUrl: 'inquiries.html',
  providers: [ApiService]
})
export class Inquiries {
  public message:string
  public uuid:string
  public token:string
  constructor(
    public apiServece: ApiService,
    public navCtrl: NavController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {}
  ionViewDidLoad() {
    console.log('ionViewDidLoad Inquiries');
    setTimeout(()=>{
    this.storage.get('uuid').then((value)=>{
      if (value){
        this.uuid = value
      }
    })
    
    this.storage.get('token')
      .then((value) => {
        if (value){
          this.token = value
        }
      });
    
    })
  }

  onSubmit(message){
    let loader = this.loadingCtrl.create({
      content: "読み込み中..",
    });
    loader.present();
    console.log(message)
    this.apiServece.postData("/api/support/questions",{content: message},this.uuid,this.token).subscribe(resp => {
      console.log(resp)
      let alert = this.alertCtrl.create({
        subTitle: "ありがとうございます。送信に成功しました",
        buttons: ['OK']
      });
      alert.present();
      loader.dismiss();
      this.navCtrl.push(Setting)
    // }).catch(err => {
    //   console.log(err)
    //   let alert = this.alertCtrl.create({
    //     subTitle: err,
    //     buttons: ['OK']
    //   });
    //   alert.present();
    //   loader.dismiss();
    })
  }

}
