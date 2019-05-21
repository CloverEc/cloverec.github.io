import { Injectable } from '@angular/core';
import { ToastController, AlertController, NavController } from 'ionic-angular';
import { Login} from '../pages/login/login';
import { ApiService} from './api-service';


@Injectable()
export class Utils {
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public apiService: ApiService,
    private toastCtrl: ToastController
  ){
  }

  forHttp(err) {
    console.log(err)
    if (err.status == 401) {
      this.apiService.setLogin(false)
      this.navCtrl.setRoot(Login,{logout: true,menu: true}) 
    } else {
      let msg = "エラーが発生しました"
      if (err._body) {
        if (JSON.parse(err._body).error) {
          msg = JSON.parse(err._body).error
        }
      }
      this.alertCtrl.create({
        subTitle: msg,
        buttons: ['OK']
      }).present()
    }
  }

  addToast() {
    this.toastCtrl.create({
      message: 'お気に入りに追加しました。',
      duration: 3000,
      position: 'bottom'
    }).present()
  }

  delToast() {
    this.toastCtrl.create({
      message: '取り消しました',
      duration: 3000,
      position: 'bottom'
    }).present()
  }

  unknowToast() {
    this.toastCtrl.create({
      message: 'Unknow error!',
      duration: 3000,
      position: 'bottom'
    }).present()
  }

  toast(msg) {
    this.toastCtrl.create({
      message: '取り消しました',
      duration: 3000,
      position: 'bottom'
    }).present()
  }
}

