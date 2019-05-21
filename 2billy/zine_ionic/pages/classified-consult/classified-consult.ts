import { Component } from '@angular/core';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'page-consult',
  providers: [ApiService, Utils],
  templateUrl: 'classified-consult.html'
})
export class ConsultPage {
  public field: any = {}
  public token: any
  public uuid: any

  constructor(
    public navCtrl: NavController,
    private apiServece: ApiService,
    private utils: Utils,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public navParams: NavParams
  ) {
    this.storage.get("token").then((val) => {
      this.token = val
    })
    this.storage.get("uuid").then((val) => {
      this.uuid = val
    })
  }

  submitForm() {
    if (!this.field.title) {
      this.alertCtrl.create({
        subTitle: "title is not blank",
        buttons: ['OK']
      }).present();
      return false
    }
    if (!this.field.email) {
      this.alertCtrl.create({
        subTitle: "Emailを入力してください",
        buttons: ['OK']
      }).present();
      return false
    }
    if (this.field.email.match(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i) == null) {
      this.alertCtrl.create({
        subTitle: "Email形式を確認ください",
        buttons: ['OK']
      }).present();
      return false
    }
    if (this.field.email_confirmation != this.field.email) {
      this.alertCtrl.create({
        subTitle: "Email　確認用に入力してください",
        buttons: ['OK']
      }).present();
      return false
    }
    if (!this.field.content) {
      this.alertCtrl.create({
        subTitle: "内容を入力してください",
        buttons: ['OK']
      }).present();
      return false
    }
    let loader = this.loadingCtrl.create()
    loader.present()
    this.apiServece.postData("/api/posts/"+this.navParams.data.postId+"/consult", this.field, this.uuid, this.token).subscribe(resp => {
      loader.dismiss()
      if (resp.code == 200) {
        let alert = this.alertCtrl.create({subTitle: 'Created successfully', buttons: ['OK']})
        alert.present();
        alert.onDidDismiss(data => { 
          this.navCtrl.pop();
        });           
      } else {
        this.alertCtrl.create({subTitle: resp.msg, buttons: ['OK']})
      }
    }, err => {
      loader.dismiss()
      this.utils.forHttp(err)
    })
  }
}
