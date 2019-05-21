import { Component } from '@angular/core';
import { ViewChild } from '@angular/core'; 
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer'; 

/**
 * Generated class for the PhotoSlidesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-photo-slides',
  templateUrl: 'photo-slides.html',
})
export class PhotoSlidesPage {
  @ViewChild(Slides) slides: Slides;
  public images: any
  constructor(
    public navCtrl: NavController, 
    private photoViewer: PhotoViewer,
    public navParams: NavParams) {
    this.images = this.navParams.get("images")
      setTimeout(()=>{
        this.slides.slideTo(this.navParams.get("index"), 0);
      },200)
    console.log(this.images)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoSlidesPage');
  }

  goBack(){
    this.navCtrl.pop()
  }
  openImage(img,title){
    this.photoViewer.show(img, title, {share: false}); 
  }
  goToSlide() {
    this.slides.slideTo(2, 500);
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
  }
}
