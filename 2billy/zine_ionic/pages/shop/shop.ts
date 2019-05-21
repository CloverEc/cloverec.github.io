import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ViewController} from 'ionic-angular';
import { Platform, Events } from 'ionic-angular'; 
import { AlertController} from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { Map} from '../map/map'
import { SocialSharing } from '@ionic-native/social-sharing'; 
import { Evaluate  } from '../evaluate/evaluate'
import { PopoverController } from 'ionic-angular'; 
import { CallNumber } from '@ionic-native/call-number'; 
import { CorrectionPage} from '../correction/correction'
import { PhotoViewerPage} from '../photo-viewer/photo-viewer'
import { ActionSheetController } from 'ionic-angular'; 
import { AddEvaluatePage} from '../add-evaluate/add-evaluate';
import { Evaluates} from '../evaluates/evaluates';
import { Login} from '../login/login';
import { HomePage } from '../home/home'
import { InAppBrowser } from '@ionic-native/in-app-browser'; 
import { Storage } from '@ionic/storage'
import { Clipboard } from '@ionic-native/clipboard'; 
import { Campaigns } from '../campaigns/campaigns'; 
import { Campaign } from '../campaign/campaign'; 
import { Navbar } from 'ionic-angular';
import { ToastController } from 'ionic-angular'; 
import { SafariViewController } from '@ionic-native/safari-view-controller'; 
declare global {
    interface Window{ plugins: any; }
}
window.plugins = window.plugins || {};
declare let Wechat: any
declare let cordova: any
declare let copyclipboard: any
@Component({
  template: `
   <h1 style="font-size:5rem;">{{address}}</h1>
  `
})
export class BigAddress {
  address: string
  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.address = this.navParams.get("address")
  
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
/**
 * Generated class for the Shop page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shop',
  providers: [ApiService, Utils],
  templateUrl: 'shop.html',
})
export class Shop {
  public shop: {
    name?:string,
    s_image?: string,
    link?: string,
    latitude?: number,
    id?: number,
    longitude?: number,
    content?: string,
    rates?: any
  } = {}
  public coupons:any
  evaluates:any
  recommends:any
  @ViewChild(Navbar) navBar: Navbar;
  public isCollect: boolean = false
  public token: string
  public uuid: string
  public prs: {id:number,avatar?:string,shop_name?: string}
  public isApp: boolean = false
  public isLoad: boolean = false
  constructor(
    public navCtrl: NavController,
    private apiServece: ApiService,
    public viewCtrl: ViewController,
    private utils: Utils,
    public platform: Platform,
    public storage: Storage,
    private callNumber: CallNumber,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public safariViewController: SafariViewController,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private socialSharing: SocialSharing,
    private iab: InAppBrowser,
    private navController: NavController,
    public events: Events,
    private clipboard: Clipboard,
    public toastCtrl: ToastController,
    public navParams: NavParams
  ) {
    this.isApp = false
    this.coupons = false
    this.prs = null
    this.recommends = false
    setTimeout(()=>{
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp = false
      }else{
        this.isApp = true
      }
    })

    this.storage.get("token").then((val: any) => {
      this.token = val
    })
    this.storage.get("uuid").then((val: any) => {
      this.uuid = val
    })
    this.shop.rates = [0,0,0,0,0,0]
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navController.pop();
    }
    console.log('ionViewDidLoad Shop');
    setTimeout(()=>{
      this.loadData()
    },500)
    setTimeout(()=>{
      if (this.navParams.get("fromMap")){
        this.loadData()
      }
    },1000)

  }


  loadData(){
        this.apiServece.getData("/api/shops/"+this.navParams.data.id, this.uuid, this.token).subscribe(resp => {
          this.shop = resp.data
            this.isCollect = resp.data.isCollect
              // loader.dismiss()
           }, err=>{
                console.error(err)
                // loader.dismiss()
           })
        this.apiServece.getData("/api/coupons?limit=15&page=1&shop_id="+this.navParams.data.id).subscribe(resp => {
         if (resp.data.length > 0){
           this.coupons = resp.data
         } 

            //   loader.dismiss()
            }, err=>{
              console.error(err)
            })
          this.apiServece.getData("/api/evaluates?recommend=false&limit=1&page=1&shop_id="+this.navParams.data.id).subscribe(resp => {
            this.evaluates  = resp.data
              //loader.dismiss()
              }, err=>{
                console.error(err)
              })
          this.apiServece.getData("/api/evaluates?recommend=true&limit=1&page=1&shop_id="+this.navParams.data.id).subscribe(resp => {
            console.log(resp)
            this.recommends  = resp.data
          }, err=>{
            console.error(err)
          })
          this.apiServece.getData("/api/prs?limit=1&page=1&shop_id="+this.navParams.data.id).subscribe(resp => {
            this.prs = resp.data
              this.isLoad = true
          }, err=>{
            console.error(err)
            this.isLoad = true
          })
  }

  onMap(){
    this.navCtrl.push(Map,{longitude: this.shop.longitude , latitude: this.shop.latitude, shop_name: this.shop.name})
  }

  shareWechat(session){
    if (session == 'SESSION'){
      Wechat.share({
        message: {
         title: this.shop.name,
         description: this.shop.content,
         thumb: this.shop.s_image,
         media: {
           type: Wechat.Type.WEBPAGE,   // webpage
           webpageUrl: "http://m.shanghai-zine.com/tabs/t0/ホーム/shop/" + this.shop.id    // webpage
          }
        },
        scene: Wechat.Scene.SESSION   // share to Timeline
      }, function () {
       // alert("Success");
      }, function (reason) {
       // alert("Failed: " + reason);
      })
    }else{
      Wechat.share({
        message: {
          title: this.shop.name,
          description: this.shop.content,
          thumb: this.shop.s_image,
          media: {
            type: Wechat.Type.WEBPAGE,   // webpage
            webpageUrl: "http://m.shanghai-zine.com/tabs/t0/ホーム/shop/" + this.shop.id     // webpage
          }
        },
        scene: Wechat.Scene.TIMELINE  // share to Timeline
      }, function () {
        //alert("Success");
      }, function (reason) {
        //alert("Failed: " + reason);
      })
    }
  }

  shareSocial(){
    //share(message, subject, file, url)
    this.socialSharing.share(this.shop.content ,this.shop.name, this.shop.s_image,"http://m.shanghai-zine.com/tabs/t0/ホーム/shop/" + this.shop.id ).then(() => {
      // Success!
      }).catch(() => {
      // Error!
    });
  }

  onEvaluate(){
    if (!this.apiServece.isLogin()) {
      this.navCtrl.setRoot(Login,{logout: true,menu: true}) 
      return
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: '投稿',
      buttons: [
        {
          text: '口コミ投稿',
          role: 'tel',
          handler: () => {
            this.navCtrl.push(AddEvaluatePage,{shop_id:this.shop.id, recomend: false})
          }
        },{
          text: 'お知らせ投稿',
          role: 'tel',
          handler: () => {
            this.navCtrl.push(AddEvaluatePage,{shop_id:this.shop.id, recommend: true})
          }
        },{
          text: 'キャンセル',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  onBigAddress(address){
    let popover = this.popoverCtrl.create(BigAddress,{address: address});
    popover.present();
     
  }
  onTelephone(tel){
    let actionSheet = this.actionSheetCtrl.create({
      title: '上海人を見てとお伝えいただけるとうれしいです！',
      buttons: [
        {
          text: tel,
          role: 'tel',
          handler: () => {
            console.log('Destructive clicked');
            this.callIT(tel)
          }
        },{
          text: 'キャンセル',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  callIT(passedNumber){
    passedNumber = encodeURIComponent(passedNumber);
    this.callNumber.callNumber(passedNumber, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'))
  }
  onModelChange(e){
    console.log(e)
  
  }

  toggleFavorite() {
    let loader = this.loadingCtrl.create()
    loader.present(loader)
    if (this.isCollect == false) {
      this.addFavorite(loader)
    } else {
      this.deleteFavorite(loader)
    }
  }

  addFavorite(loader) {
    this.apiServece.putData("/api/bookmarks?type=shops&target_id="+this.shop.id, this.uuid, this.token).subscribe(resp => {
      this.isCollect = true
      loader.dismiss()
      this.utils.addToast()
      this.events.publish('bookmark_count:changed', {type: "shops", count: 1});
    }, err => {
      loader.dismiss()
      this.utils.forHttp(err)
    })
  }

  deleteFavorite(loader) {
    this.apiServece.deleteData("/api/bookmarks?type=shops&target_id="+this.shop.id, this.uuid, this.token).subscribe(resp => {
      this.isCollect = false
      loader.dismiss()
      this.utils.delToast()
      this.events.publish('bookmark_count:changed', {type: "shops", count: -1});
    }, err => {
      loader.dismiss()
      this.utils.forHttp(err)
    })
  }

  openEvaluates(){
    this.navCtrl.push(Evaluates,{shop_id: this.shop.id})
  }
  
  openRecommends(){
    this.navCtrl.push(Evaluates,{shop_id: this.shop.id,recommend: true})
  }

  onCorrection(){
    this.navCtrl.push(CorrectionPage,{shop_id: this.shop.id})
  }

  onPhotoViewer(){
    this.navCtrl.push(PhotoViewerPage,{shop_id: this.shop.id})
  }

  openPage(url){
    if (!url){
     return false;
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: 'ホームページへ移動する',
      buttons: [
        {
          text: url,
          role: 'url',
          handler: () => {
            if (this.platform.is('cordova')) {
              // const browser = this.iab.create(url,"_blank","toolbar=yse")
                 this.safariViewController.isAvailable()
                   .then((available: boolean) => {
                     if (available) {
                       this.safariViewController.show({
                         url: url,
                         hidden: false,
                         animated: false,
                         transition: 'curl',
                         enterReaderModeIfAvailable: true,
                         tintColor: '#ff0000'
                       }).subscribe(()=>{
                       })
                     }else{
                       const browser = this.iab.create(url,"_blank","toolbar=yse")
                     }
                   })
            }else{
              window.open(url,'_blank');
            }
            console.log('Destructive clicked');
          }
        },{
          text: 'キャンセル',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  addLike(id){
    setTimeout(()=>{    
      let loader = this.loadingCtrl.create()
      loader.present()
      this.apiServece.putData("/api/follow?type=shops&follow_id="+this.shop.id, this.uuid, this.token).subscribe(resp => {
        this.apiServece.getData("/api/shops/"+this.shop.id, this.uuid, this.token).subscribe(resp => {
          this.shop = resp.data
          this.isCollect = resp.data.isCollect
        }, err=>{
          console.error(err)
        })
        loader.dismiss()
        this.events.publish('shops:reload', this.shop.id);
      }, err => {
        loader.dismiss()
        if (err.status && err.status == 401) {
          this.navCtrl.setRoot(Login,{logout: true,menu: true}) 
        }
      })
    },0)
  }

  copyStr(str){
    if(this.isApp){
      setTimeout(()=>{
        if (this.platform.is('ios')) {
          this.clipboard.copy(str);
        } else if (this.platform.is('android')) {
          copyclipboard.copy(str)
        }
      },100)

      let toast = this.toastCtrl.create({
        message: 'コピーしました',
        duration: 3000
      });
      toast.present();
    }
  }

  openHome(){
    this.navCtrl.setRoot(HomePage) 
  }

  openCoupon(cId) {
    this.navCtrl.push(Campaign, {id: cId})
  }

}
