import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular'; 
import { Slides } from 'ionic-angular';  
import { ViewController,NavController , MenuController,Events } from 'ionic-angular';
import { AlertController} from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Search } from '../search/search'; 
import { Category } from '../category/category'; 
import { Topic } from '../topic/topic'; 
import { Topics } from '../topics/topics'; 
import { Shop } from '../shop/shop'; 
import { Login } from '../login/login'; 
import { Campaigns } from '../campaigns/campaigns'; 
import { Campaign } from '../campaign/campaign'; 
import { Evaluates } from '../evaluates/evaluates'; 
import { UserDetail } from '../user-detail/user-detail'; 
import { Shops } from '../shops/shops'; 
import { AddShop } from '../add-shop/add-shop'; 
import { ClassifiedsPage } from '../classifieds/classifieds'; 
import { MyApp } from '../../app/app.component'
import { PopoverController } from 'ionic-angular'; 
import { Content } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { InAppBrowser } from '@ionic-native/in-app-browser'; 
import { SafariViewController } from '@ionic-native/safari-view-controller'; 

@Component({
  template: `
  <ion-list no-padding color="zine">
    <button color="zine" ion-item (click)="openAddShops()"><ion-icon name="add"></ion-icon>店舗登録</button>
    <button color="zine" ion-item (click)="openNewShops()"><ion-icon name="home"></ion-icon>新店情報</button>
    <button color="zine" ion-item (click)="openEvaluates()"><ion-icon name="chatboxes"></ion-icon>口コミ一覧</button>
    <button color="zine" ion-item (click)="openGourmetShops()"><ion-icon name="restaurant"></ion-icon>グルメ</button>
  </ion-list>
  `
})

export class PopoverPage {
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController
  ) {}

  close() {
    this.viewCtrl.dismiss({link: null});
  }

  openAddShops(){
    this.viewCtrl.dismiss({link: 'AddShop'});
  }

  openNewShops() {
    this.viewCtrl.dismiss({link: 'Shop'});
  }

  openEvaluates(){
    this.viewCtrl.dismiss({link: 'Evaluates'});
  }

  openGourmetShops(){
    this.viewCtrl.dismiss({link: 'Gourmet'});
  }
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiService]
})
export class HomePage {
  @ViewChild(Content) content: Content
  @ViewChild(Slides) slides: Slides;
  @ViewChild('target') private hovedInnhold : ElementRef;
  private scrollElement; 
  public isLoad: boolean
  public topBanner: any[]
  public topNews: any[]
  public topCoupons: any[]
  public topTopics: any[]
  public topEvaluates: any[]
  public posts: any[]
  public inputComponent: MyApp
  public token: string
  public uuid: string
  public uid: string
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    private apiServece: ApiService,
    private iab: InAppBrowser,
    public events: Events,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    private safariViewController: SafariViewController,
    public popoverCtrl: PopoverController
  ) {
    this.topBanner = []
    this.isLoad = false
    this.topEvaluates =[]
    setTimeout(() => {
      this.loadBanners()
      this.loadClassifieds()
      this.loadTopics()
      this.loadCoupons()
      this.loadEvaluates()
    },100)
    events.subscribe('home:scrollToTop', (time) => {
      setTimeout(()=>{ 
        this.scrollToTop();
      },100)
    });

    setTimeout(()=>{
      this.storage.get('uuid').then((value)=>{
        if (value) this.uuid = value
      })
      this.storage.get('uid').then((value)=>{
        if (value) this.uid = value
      })
      this.storage.get('token').then((value)=>{
        if (value) this.token = value
      })
    }, 1)
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.loadBanners()
      this.loadClassifieds()
      this.loadTopics()
      this.loadCoupons()
      this.loadEvaluates()
    },600)

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  loadBanners() {
    this.apiServece.getData("/api/mobile/top_banners").subscribe(data => {
      this.topBanner = data.data
    }, err=>{
      console.error(err)
    })
  }

  loadTopics() {
    this.apiServece.getData("/api/topics?limit=3&page=1&include_news=false").subscribe(resp => {
      this.topTopics = resp.data
    }, err=>{
      console.error(err)
    })
  }

  loadCoupons() {
    this.apiServece.getData("/api/coupons?limit=3&page=1").subscribe(resp => {
      console.log(resp)
      this.topCoupons = resp.data
    }, err=>{
      console.error(err)
      this.isLoad = true
    })
  }

  loadClassifieds() {
    this.apiServece.getData("/api/posts?cid=99&limit=2&page=1").subscribe(resp => {
      console.log(resp)
      resp.posts.forEach((v,i)=>{
        let color = this.category2color(v.bbs_category)
          resp.posts[i]["bbs_color"] = color
      })
      this.posts = [resp.posts[0], resp.posts[1]]
      // this.isLoad = true
    }, err => {
      console.error(err)
      this.isLoad = true
    })
  }
  
  loadEvaluates() {
    this.apiServece.getData("/api/evaluates?limit=1&page=1").subscribe(resp => {
      this.topEvaluates = resp.data
      console.log(resp)
      this.isLoad = true
    }, err=>{
      console.error(err)
      this.isLoad = true
    })
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present(
    { ev: myEvent }
    );
    popover.onDidDismiss(data=>{
      if (data){
        switch (data.link){
         case "AddShop":
            if (this.apiServece.isLogin()) {
              this.navCtrl.push(AddShop);
            } else {
              this.navCtrl.setRoot(Login,{logout: true,menu: true}) 
            }
           break;
         case "Shop":
          this.navCtrl.push(Shops,{sort:6});
          break;
         case "Evaluates":
            this.navCtrl.push(Evaluates);
            break;
         case "Gourmet":
            this.navCtrl.push(Shops,{cate: 10});
            break;
         case null:
           break
         default:
           break
        }
      }
    });
  }

  openMenu() {
    this.menuCtrl.open();
  }

  openSearch(){
    this.navCtrl.push(Search)
  }
  openCategory(){
    this.navCtrl.push(Category)
  }

  openCoupons() {
    this.navCtrl.push(Campaigns)
  }

  openCoupon(cId) {
    this.navCtrl.push(Campaign, {id: cId})
  }

  openTopic(topicId) {
    this.navCtrl.push(Topic, {id: topicId})
  }

  openTopics() {
    this.navCtrl.push(Topics)
  }

  openNearShops() {
    this.navCtrl.push(Shops, {cate: 10, isNearby: true})
  }

  openShop(shopId) {
    this.navCtrl.push(Shop, {id: shopId})
  }

  openUserDetail(userId) {
    this.navCtrl.push(UserDetail, {id: userId})
  }

  openEvaluates() {
    this.navCtrl.push(Evaluates)
  }

  openBanner(banner) {
    console.log(banner)
    if (banner.banner_type == "topic") {
      this.navCtrl.push(Topic, {id: banner.id})
    }else if (banner.banner_type == "url"){
       let actionSheet = this.actionSheetCtrl.create({
         title: 'ホームページへ移動する',
         buttons: [
           {
             text: banner.link,
             role: 'url',
             handler: () => {
               if (this.platform.is('cordova')) {

                 this.safariViewController.isAvailable()
                   .then((available: boolean) => {
                     if (available) {
                       this.safariViewController.show({
                         url: banner.link,
                         hidden: false,
                         animated: false,
                         transition: 'curl',
                         enterReaderModeIfAvailable: true,
                         tintColor: '#ff0000'
                       }).subscribe(()=>{
                       })
                     }else{
                       const browser = this.iab.create(banner.link,"_blank","toolbar=yse")
                     }
                 })
               }else{
                 window.open(banner.link,'_blank');
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
  }
  
  openClassifieds() {
    this.navCtrl.push(ClassifiedsPage)
  }

  scrollToTop() {
    // this.hovedInnhold.nativeElement.scrollTop = 0
    // this.content.scrollTo(0, element.offsetTop, 500)
    setTimeout(() => {
      try{
        let element = document.getElementById('target');
        this.content.scrollTo(0, element.offsetTop, 500)
      
      }catch(e){
//       console.log(e)
      }
      
    },100);
  }
 category2color(s){
        let color:string = ""
        switch (s) {
          case '総合':
            color = "orange";
            break;
          case '売ります':
            color = "danger"
            break;
          case '買います':
            color = "blue"
            break;
          case '住宅':
            color = "facebook"
            break;
          case '求人':
            color = "green";
           break;
          case '友達募集':
            color = 'orange';
           break;
          case '学ぶ':
            color = 'wechat';
           break;
          case 'ビジネス':
            color = 'blue';
           break;
          case '求職':
            color = "danger";
           break;
          case 'その他':
            color = "green";
           break;
          default:
            color = 'zine';
        }
    return color
 }
}


