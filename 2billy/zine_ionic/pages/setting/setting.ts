import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TutorialPage } from '../tutorial/tutorial';
import { Inquiries } from '../inquiries/inquiries'; 
import { Infomation } from '../infomation/infomation'; 

/**
 * Generated class for the Setting page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class Setting {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Setting');
  }

  openTutorial(){
    this.navCtrl.push(TutorialPage)
  }
  
  openInfomation(){
    this.navCtrl.push(Infomation)
  }

  openInquiries(){
    this.navCtrl.push(Inquiries)
  }
}
