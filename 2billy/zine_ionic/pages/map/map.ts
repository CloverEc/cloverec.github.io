import { Component } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator'; 
import { Geolocation } from '@ionic-native/geolocation';
import {DomSanitizer} from '@angular/platform-browser';
// Adding the script tag to the head as suggested before
/**
 *g Generated class for the Map page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class Map {
  public map: any;
  public isUrl: boolean = false
  public appMap: boolean = false
  public isLoad:boolean  = false
  public isApp: boolean = false
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private launchNavigator: LaunchNavigator,
    private geolocation: Geolocation,
    private sanitizer: DomSanitizer,
    public navParams: NavParams) {
    setTimeout(()=>{
    if(this.navParams.get("shops")){
     this.appMap = false
    }else{
     this.appMap = true
    }
     this.isUrl = true
     this.isLoad = true
    },1000)
    this.isApp = false
    setTimeout(()=>{
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.appMap = true
      }else{
        this.appMap = false
      }
    })
  }

  mapURL(){
    let url:string = ""
    if(this.navParams.get("shops")){
     let params:string = ""
     var shops = this.navParams.get("shops") 
     shops.forEach((v,i)=>{
       params +=  "name[]=" + v.name + "&" + "center[]=" +  v.longitude + "," + v.latitude +  "&"
     })
      url = encodeURI("https://api2.shanghai-zine.com/map.html?longitude=" + this.navParams.get("longitude") + "&latitude= " + this.navParams.get("latitude") + "&" + params)
    }else{
      url = encodeURI("https://m.amap.com/navi/?dest=" + this.navParams.get("longitude") + "," + this.navParams.get("latitude") +  "&destName=" + this.navParams.get("shop_name") + "&hideRouteIcon=1&key=81486a6fa1ec984dce3392d7a2103690#map-view")
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ionViewDidLoad() {
    // this.loadMap();
    console.log('ionViewDidLoad Map');
  }

 
   onMapApp(){
     this.geolocation.getCurrentPosition().then((resp) => {
         var current_latitude = resp.coords.latitude
         var current_longitude = resp.coords.longitude
 
           let options: LaunchNavigatorOptions = {
             start: current_latitude + "," + current_longitude
           }
           setTimeout(()=>{
             this.launchNavigator.navigate([this.navParams.get("latitude"),this.navParams.get("longitude")], options)
               .then(
                 success => console.error('Launched navigator'),
                 error => console.error('Error launching navigator', error)
               );
           },500)
        }).catch((error) => {
          console.error('Error getting location', error);
       });
   }
}
