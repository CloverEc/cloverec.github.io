import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AlertController, Platform } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { Shop } from '../shop/shop'; 
import { Evaluates } from '../evaluates/evaluates'
import { Map } from '../map/map'; 
import { Range } from '../range/range'; 
import { Search } from '../search/search'; 
import { CorrectionPage} from '../correction/correction'
import { ShopsCategory } from '../shops-category/shops-category'; 
import { PopoverController } from 'ionic-angular'; 
import { App } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage'
import { InAppBrowser } from '@ionic-native/in-app-browser'; 
import { Events } from 'ionic-angular';

@Component({
  template: `
  <ion-list>
    <button *ngFor="let sort of sorts" ion-item (click)="close(sort)">{{sort.val}}</button>
  </ion-list>
  `
})

export class Sort {
  public sorts: any[] = [
    {id: 0, val: "最新順"},
    {id: 1, val: "近い順"},
    {id: 2, val: "イイね！"},
    {id: 3, val: "月間アクセス"},
    {id: 4, val: "口コミ"},
    {id: 5, val: "キャンペーン"}
  ]
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
  }

  close(sort) {
    this.viewCtrl.dismiss();
    this.navParams.data.shops.sort = sort.id
    this.navParams.data.shops.selectedSort = sort.val
    if (sort.id == 2 && this.navParams.data.shops.distance) {
      this.navParams.data.shops.distance = null
      this.navParams.data.shops.selectedRange = "距離"
    }
    this.navParams.data.shops.loadShops()
  }
}

/**
 * Generated class for the Shops page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shops',
  providers: [ApiService, Utils],
  templateUrl: 'shops.html',
})

export class Shops {
  public shops: any[] = []
  public currentPage: number = 1
  public totalPage: number
  public lat: number = 0.000000
  public lng: number = 0.000000
  public cate: number
  public sort: number
  public area_id: number
  public distance: number
  public searchWord: string
  public selectedRange: string = "距離"
  public selectedSort: string = "並び替え"
  public token: string
  public uuid: string
  public baseUrl: string = "/api/shops/nearby?limit=15"
  public isMember: boolean = false
  public scrollEnable: boolean = false
  public isApp:boolean = false

  constructor(
    public navCtrl: NavController,
    public app: App,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private apiService: ApiService,
    private utils: Utils,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    private platform: Platform,
    private geolocation: Geolocation,
    public storage: Storage,
    private iab: InAppBrowser,
    public navParams: NavParams,
    private events: Events
  ) {
    setTimeout(()=>{
      this.storage.get("lat").then((value) => {
        this.lat = value
      })
      this.storage.get("lng").then((value) => {
        this.lng = value
      })
    },0)
    console.log(this.navParams.data)
      events.subscribe('shops:reload', (id) => {
        this.shops.forEach((v,i)=>{
          if(v.id ==  id){
            if(v.islike){
             this.shops[i].islike = false
             --this.shops[i].likenum
            }else{
             this.shops[i].islike = true
             ++this.shops[i].likenum
            }
            console.log(v)
          }
        })
          // user and time are the same arguments passed in `events.publish(user, time)`
          //     console.log('Welcome', user, 'at', time);
    });

    this.searchWord = this.navParams.data.searchWord
   if (this.navParams.data.cate) this.cate = this.navParams.data.cate
    if (this.navParams.data.sort) this.sort = this.navParams.data.sort
    if (this.navParams.data.isNearby) {
      // this.baseUrl = "/api/shops/nearby?limit=15"
      this.selectedRange = "2000m"
      this.selectedSort = "近い順"
      this.distance = 2000
      this.sort = 1
    }
    this.storage.get("token").then((token) => {
      this.token = token
    })
    this.storage.get("uuid").then((uuid) => {
      this.uuid = uuid
    })
    if (this.navParams.data.isMember) {
      this.isMember = this.navParams.data.isMember
      this.baseUrl = "/api/bookmarks?type=shops&limit=15"
    }
  }

  ionViewDidLoad() {
    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      if ("geolocation" in navigator) {
        window.navigator.geolocation.getCurrentPosition((pos) => {
          console.log(pos.coords.latitude, pos.coords.longitude);
          this.lat = pos.coords.latitude
            this.lng = pos.coords.longitude
              if (pos.coords.latitude){
                this.storage.set("lat",pos.coords.latitude)
                this.storage.set("lng",pos.coords.longitude)
              }
        },err => {
          let alert = this.alertCtrl.create({
            title: '位置情報が取得できません。',
            message: 'アプリをダウンロードしてください。',
            buttons: [
              {
                text: 'ダウンロードAPP',
                handler: () => {
                  let url = "http://shanghai-zine.com/redirect_mobile/app/index.html"
                    window.open(url,'_blank');
                  console.log('Buy clicked');
                }
              },
              {
                text: 'キャンセル',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          alert.present();
        })
      }else{
        setTimeout(()=>{
          this.geolocation.getCurrentPosition().then(pos => {
            console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
            this.lat = pos.coords.latitude
              this.lng = pos.coords.longitude
                this.storage.set("lat",pos.coords.latitude)
                this.storage.set("lng",pos.coords.longitude)
          })
          const watch = this.geolocation.watchPosition().subscribe(pos => {
            //  this.lat = pos.coords.latitude 
            //  this.lng = pos.coords.longitude
            console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
            this.storage.set("lat",pos.coords.latitude)
            this.storage.set("lng",pos.coords.longitude)
          })
          watch.unsubscribe();
        },300)
      }
      }
    setTimeout(()=>{
      this.loadShops()
    },1000)
  }

  openShop(shopId) {
    this.navCtrl.push(Shop, {id: shopId}) }

  openEvaluates(shopId) {
    this.navCtrl.push(Evaluates, {shop_id: shopId})
  }
  shopsUrl(): string {
    if (this.searchWord) this.baseUrl = "/api/search?limit=15&q="+this.searchWord
    let reqUrl = this.baseUrl+"&page="+this.currentPage+"&lat="+this.lat+ "&lng="+this.lng
    if (this.cate) reqUrl += ("&cate_id="+this.cate)
    if (this.area_id) reqUrl += ("&area_id="+this.area_id)
    if (this.sort) reqUrl += ("&sort="+this.sort)
    if (this.distance) reqUrl += ("&distance="+this.distance)
    return reqUrl
  }

  loadShops() {
    let loader = this.loadingCtrl.create()
    loader.present()
    this.shops = []
    this.currentPage = 1
    this.apiService.getData(this.shopsUrl(), this.uuid, this.token).subscribe(resp => {
      loader.dismiss()
      resp.data.forEach(shop => {
        this.shops.push(shop)
      })
      this.currentPage = resp.current_page
      this.totalPage = resp.total_page
      this.totalPage > this.currentPage ? this.scrollEnable = true : this.scrollEnable = false
    }, err=>{
      this.utils.forHttp(err)
      loader.dismiss()
    })
  }

  doInfinite(infiniteScroll) { 
    setTimeout(() => {
      this.currentPage += 1
      this.apiService.getData(this.shopsUrl(), this.uuid, this.token).subscribe(resp => {
        this.currentPage = resp.current_page
        this.totalPage = resp.total_page
        resp.data.forEach(shop => {
          this.shops.push(shop)
        })
        infiniteScroll.complete();
        this.totalPage > this.currentPage ? this.scrollEnable = true : this.scrollEnable = false
      }, err=>{
        infiniteScroll.complete();
      })
    }, 500);
  }

  presentRange(myEvent) {
    let popover = this.popoverCtrl.create(Range, {shops: this});
    popover.present(
    { ev: myEvent }
    );
  }

  presentSort(myEvent) {
    let popover = this.popoverCtrl.create(Sort, {shops: this});
    popover.present(
      { ev: myEvent }
    );
  }

  presentCategory(myEvent) {
    let popover = this.popoverCtrl.create(ShopsCategory, {shops: this});
    popover.present(
    { ev: myEvent }
    );
  }

  openSearch(){
    this.navCtrl.push(Search)
  }

  dropBookmark(selectedShop) {
    let confirm = this.alertCtrl.create({                                                                                           
      title: '削除しますか？',                                                                                                            
      message: '',                                                                                                                  
      buttons: [                                                                                                                    
        {                                                                                                                           
          text: '取消',                                                                                                             
          handler: () => {                                                                                                          
            console.log('Disagree clicked')                                                                                         
          }                                                                                                                         
        }, {
          text: '確認', 
          handler: () => {
            this.shops.forEach((shop, ind) => {                                                                               
              if(shop == selectedShop){
                this.apiService.deleteData("/api/bookmarks?type=shops&target_id="+selectedShop.id, this.uuid, this.token).subscribe(resp => {
                  if (resp.code == 200) {
                    this.shops.splice(ind, 1)
                    if (this.navParams.data.currentUser) {
                      this.navParams.data.currentUser.shops_cnt -= 1
                      console.log(this.navParams.data)
                    }
                  }
                }, err=>{
                })
              }
            })                                                                                                                      
          }                                                                                                                         
        }                                                                                                                           
      ]                                                                                                                             
    });                                                                                                                             
    confirm.present();
  }
  addLike(id){
    setTimeout(()=>{    
      let loader = this.loadingCtrl.create()
      loader.present()
      this.apiService.putData("/api/follow?type=shops&follow_id="+ id, this.uuid, this.token).subscribe(resp => {
        setTimeout(() => {
          this.loadShops()
          loader.dismiss()
        }, 500)
      }, err => {
        loader.dismiss()
      })
    },0)
  }
  onCorrection(id){
    this.navCtrl.push(CorrectionPage,{shop_id: id})
  }

  openMap(){
    let url:string = ""
     let params:string = ""
     this.shops.forEach((v,i)=>{
       if (i < 10){
         params +=  "name[]=" + v.name + "&" + "center[]=" +  v.longitude + "," + v.latitude +  "&"
       }
     })
      url = encodeURI("https://m.shanghai-zine.com/map.html?longitude=" + this.lng + "&latitude= " + this.lat + "&" + params)
        if (this.platform.is('cordova')) {
          const browser = this.iab.create(url,"_blank","EnableViewPortScale=yes,closebuttoncaption=Done")
          let isFlg = false
          browser.on("loadstop").subscribe(e =>{
            browser.executeScript( { code: "localStorage.setItem( 'name', '' );" } ).then(()=> { 
              let loop = setInterval(()=> {
                browser.executeScript( { code:"localStorage.getItem( 'name' ) " }).then((data)=>{
                  if (data != '' && !isFlg){
                     this.shops.forEach((v,i)=>{
                        if (v.name == data && isFlg == false ){
                          clearInterval(loop)
                          isFlg = true
                          browser.close()
                          setTimeout(()=>{
                            this.navCtrl.push(Shop,{id: this.shops[i].id,fromMap: true});
                          },500)
                        }
                     })
                  }
                })           
              })
            });
          })
        }else{
          window.open(url,'_blank');
        }
    // this.navCtrl.push(Map,{ 
    //   latitude: this.lat ,
    //   longitude: this.lng ,
    //   shops: this.shops})
  }
}
