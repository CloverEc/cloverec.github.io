import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utile'
import { Shop } from '../shop/shop'; 
import { HomePage } from '../home/home'
import { SocialSharing } from '@ionic-native/social-sharing'; 
import { Campaigns } from '../campaigns/campaigns'; 
import { Map} from '../map/map'
import { CallNumber } from '@ionic-native/call-number'; 
import { Platform } from 'ionic-angular'; 
import { ActionSheetController } from 'ionic-angular'; 

declare let Wechat: any

/**
 * Generated class for the Campaign page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-campaign',
  providers: [ApiService],
  templateUrl: 'campaign.html',
})
export class Campaign {
  public campaign: any
  public campaigns: any[]
  public firstCouponImg: any
  public otherCouponImgs: any[]
  public isMoreImgs: boolean = false
  public isApp:boolean = false
  public isLoad:boolean  = false

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private apiServece: ApiService,
    private socialSharing: SocialSharing,
    private callNumber: CallNumber,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public navParams: NavParams
  ) {
    this.isApp = false
    setTimeout(()=>{
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
      // if (this.platform.is('ios') || this.platform.is('android')){
        this.isApp = false
      }else{
        this.isApp = true
      }
    })
    setTimeout(()=>{
    this.apiServece.getData("/api/coupons/"+this.navParams.data.id).subscribe(resp => {
      this.campaign = resp.data
      if (this.campaign.coupon_images.length > 1) {
        this.firstCouponImg = this.campaign.coupon_images[0]
      }
      if (this.campaign.coupon_images.length > 2) {
        this.otherCouponImgs = []
        this.campaign.coupon_images.forEach((img, ind) => {
          if (ind > 0) {
            this.otherCouponImgs.push(img)
          }
        })
      }
      this.loadCoupons()
      this.isLoad = true
    }, err=>{
      console.error(err)
      this.isLoad = true
      this.alertCtrl.create({subTitle: this.apiServece.errTitle, buttons: ['OK']}).present()
    })
    },500)
  }

  loadCoupons() {
    this.apiServece.getData("/api/coupons?limit=3&page=1").subscribe(resp => {
      this.campaigns = []
      resp.data.forEach((camp) => {
        if (camp.id != this.campaign.id) {
          this.campaigns.push(camp)
        }
      })
    }, err=>{
      console.error(err)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Campaign');
  }

  openShop(shopId) {
    this.navCtrl.push(Shop, {id: shopId})
  }

  openCoupons() {
    this.navCtrl.push(Campaigns)
  }

  openCampaign(campaign) {
    this.navCtrl.push(Campaign, {id: campaign.id})
  }

  onMap() {
    this.navCtrl.push(Map,{longitude: this.campaign.longitude , latitude: this.campaign.latitude, shop_name: this.campaign.shop_name})
  }

  toggleMore() {
    if (this.isMoreImgs == true) {
      this.isMoreImgs = false
    } else {
      this.isMoreImgs = true
    }
  }
  callIT(passedNumber){
    passedNumber = encodeURIComponent(passedNumber);
    this.callNumber.callNumber(passedNumber, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'))
  }

  shareWechat(session){
    if (session == 'SESSION'){
      Wechat.share({
        message: {
         title: this.campaign.name,
         description: this.campaign.name,
         thumb: this.campaign.image,
         media: {
           type: Wechat.Type.WEBPAGE,   // webpage
           webpageUrl: "http://m.shanghai-zine.com/tabs/t0/ホーム/campaign/" + this.campaign.id  // webpage
          }
        },
        scene: Wechat.Scene.SESSION   // share to Timeline
      }, function () {
       // alert("Success");
      }, function (reason) {
        //alert("Failed: " + reason);
      })
    }else{
      Wechat.share({
        message: {
          title: this.campaign.name,
          description: this.campaign.name,
          thumb: this.campaign.image,
          media: {
            type: Wechat.Type.WEBPAGE,   // webpage
            webpageUrl: "http://m.shanghai-zine.com/tabs/t0/ホーム/campaign/" + this.campaign.id   // webpage
          }
        },
        scene: Wechat.Scene.TIMELINE  // share to Timeline
      }, function () {
      //  alert("Success");
      }, function (reason) {
        //alert("Failed: " + reason);
      })
    }
  }

  shareSocial(){
    this.socialSharing.share(this.campaign.name, this.campaign.image, "http://m.shanghai-zine.com/campaign/" + this.campaign.id).then(() => {
      // Success!
      }).catch(() => {
      // Error!
    });
  }
  openHome(){
    this.navCtrl.setRoot(HomePage) 
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
}
