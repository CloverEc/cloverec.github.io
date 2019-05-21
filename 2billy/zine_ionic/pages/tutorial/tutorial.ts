import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams ,Slides} from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';  
/**
 * Generated class for the Tutorial page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {
  showSkip = true;

  @ViewChild('slides') slides: Slides
  constructor(
    public navCtrl: NavController,
    public storage: Storage
  ) {
  }

  startApp() {
    this.navCtrl.push(TabsPage).then(() => {
      this.storage.set('hasSeenTutorial', 'true');
    })
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
  }

}
