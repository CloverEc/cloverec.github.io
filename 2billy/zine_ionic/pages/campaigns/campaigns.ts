import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular'; 
import { ApiService} from '../../providers/api-service'
import { Campaign } from '../campaign/campaign'; 

@Component({
  template: `
    <ion-list>
      <button *ngFor="let area of areas" ion-item (click)="close(area)">{{area.name}}</button>
    </ion-list>
  `
})

export class PopoverAreas {
  public areas: any[] = [
    {id: null, name: "全部"},
    {id: 10, name: "人民広場"},
    {id: 15, name: "徐家匯"},
    {id: 23, name: "古北"},
    {id: 24, name: "虹梅路"},
    {id: 27, name: "北新涇"},
    {id: 41, name: "世紀公園"}
  ]
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {}

  close(area) {
    console.log(area)
    this.viewCtrl.dismiss();
    this.navParams.data.campaigns.areaId = area.id
    this.navParams.data.campaigns.loadCampaigns()
    this.navParams.data.campaigns.selectedArea = area.name
  }
}

@Component({
  template: `
    <ion-list>
      <button *ngFor="let cate of categories" ion-item (click)="close(cate)">{{cate.name}}</button>
    </ion-list>
  `
})

export class PopoverCategories {
  public categories: any[] = [
    {id: null, name: "全部"},
    {id: 1, name: "グルメ"},
    {id: 3, name: "学ぶ"},
    {id: 4, name: "観光・ホテル"},
    {id: 5, name: "美容・マッサージ"},
    {id: 7, name: "不動産・生活"}
  ]
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {}

  close(cate) {
    this.viewCtrl.dismiss();
    this.navParams.data.campaigns.cateId = cate.id
    this.navParams.data.campaigns.loadCampaigns()
    this.navParams.data.campaigns.selectedCategory = cate.name
  }
}

@Component({
  template: `
    <ion-list>
      <button *ngFor="let type of types" ion-item (click)="close(type)">{{type.name}}</button>
    </ion-list>
  `
})

export class PopoverTypes {
  public types: any[] = [
    {id: 0, name: "全部"},
    {id: 1, name: "普通"}
  ]
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {}

  close(type) {
    this.viewCtrl.dismiss();
    this.navParams.data.campaigns.couponType = type.id
    this.navParams.data.campaigns.loadCampaigns()
    this.navParams.data.campaigns.selectedCoupon = type.name
  }
}


/**
 * Generated class for the Campaigns page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-campaigns',
  providers: [ApiService],
  templateUrl: 'campaigns.html',
})
export class Campaigns {
  public currentPage: number = 1
  public totalPage: number = 1
  public campaigns = []
  public areaId: number
  public cateId: number
  public couponType: string
  public selectedArea = "地区"
  public selectedCategory = "分類"
  public selectedCoupon = "種别"
  public scrollEnable: boolean = false

  constructor(
    private apiServece: ApiService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public navParams: NavParams
  ) {
    this.loadCampaigns()
  }

  loadUrl(): string {
    let url = "/api/coupons?limit=15&page="+this.currentPage
    if (this.areaId) url += ("&area_id="+this.areaId)
    if (this.cateId) url += ("&cate_id="+this.cateId)
    if (this.couponType) url += ("&coupon_type="+this.couponType)
    return url
  }

  loadCampaigns() {
    let loader = this.loadingCtrl.create()
    loader.present()
    this.currentPage = 1
    this.campaigns = []
    this.apiServece.getData(this.loadUrl()).subscribe(resp => {
      resp.data.forEach(evaluate => {
        this.campaigns.push(evaluate)
      })
      this.currentPage = resp.current_page
      this.totalPage = resp.total_page
      if (this.totalPage > this.currentPage) {
        this.scrollEnable = true
      } else {
        this.scrollEnable = false
      }
      loader.dismiss()
    }, err=>{
      console.error(err)
      loader.dismiss()
    })
  }

  openCampaign(campaignId) {
    this.navCtrl.push(Campaign, {id: campaignId})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Campaigns');
  }

  doInfinite(infiniteScroll) { 
    setTimeout(() => {
      this.currentPage += 1
      this.apiServece.getData(this.loadUrl()).subscribe(resp => {
        resp.data.forEach(evaluate => {
          this.campaigns.push(evaluate)
        })
        this.currentPage = resp.current_page
        if (this.currentPage >= this.totalPage) this.scrollEnable = false
        infiniteScroll.complete();
      }, err=>{
        infiniteScroll.complete();
      })
    }, 500);
  }

  presentArea(myEvent) {
    let popover = this.popoverCtrl.create(PopoverAreas, {campaigns: this});
    popover.present(
      { ev: myEvent }
    );
  }

  presentCategory(myEvent) {
    let popover = this.popoverCtrl.create(PopoverCategories, {campaigns: this});
    popover.present(
      { ev: myEvent }
    );
  }

  presentType(myEvent) {
    let popover = this.popoverCtrl.create(PopoverTypes, {campaigns: this});
    popover.present(
      { ev: myEvent }
    );
  }
}
