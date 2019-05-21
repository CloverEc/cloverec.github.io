import { Component } from '@angular/core';
import { ApiService} from '../../providers/api-service'
import { NavController, LoadingController, ViewController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'; 
import { PopoverController } from 'ionic-angular'; 
import { UserDetail } from '../user-detail/user-detail'; 
import { Shop }  from '../shop/shop'
import { PhotoSlidesPage }  from '../photo-slides/photo-slides'
import { Evaluate }  from '../evaluate/evaluate'

@Component({
  providers: [ApiService],
  template: `
  <ion-list no-padding color="zine">
    <button ion-item *ngFor="let type of types" (click)="openPickups(type)">
      {{type.name}}
    </button>
  </ion-list>
  `
})

export class EditorPopoverPage {
  public types: any[] = []
  constructor(
    public viewCtrl: ViewController,
    public apiServece: ApiService,
    public navParams: NavParams,
    public navCtrl: NavController
  ) {
    this.apiServece.getData("/api/pickups/name_list").subscribe(resp => {
      console.log(resp)
      this.types = resp.data
    }, err=>{
    })
  }

  close() {
    this.viewCtrl.dismiss({link: null});
  }

  openPickups(type){
    this.viewCtrl.dismiss()
    this.navParams.data.pickupPage.loadById(type.id)
  }
}

@Component({
  selector: 'page-editorial-department',
  providers: [ApiService],
  templateUrl: 'editorial-department.html'
})
export class EditorialDepartment {
  public uuid: string
  public token: string
  public evaluates: any[]
  public currentPage:number = 1
  public totalPage:number
  public loadId:number

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    private apiServece: ApiService
  ) {
    this.storage.get("uuid").then((val: any) => {
      this.uuid = val
    })
    this.storage.get("token").then((val: any) => {
      this.token = val
    })
    setTimeout(() => {
      this.loadData()
    }, 500)
  }

  loadUrl() {
    let url: string = "/api/pickups"
    if (this.loadId) {
      url = "/api/pickups/"+this.loadId
    }
    return url
  }

  loadData() {
    let loader = this.loadingCtrl.create()
    loader.present()
    this.apiServece.getData(this.loadUrl()+"?limit=15&page=1", this.uuid, this.token).subscribe(resp => {
      this.evaluates = []
      resp.data.forEach(evaluate => {
        this.evaluates.push(evaluate)
      })
      this.currentPage = resp.current_page
      this.totalPage = resp.total_page
      loader.dismiss()
    }, err=>{
      console.error(err)
      loader.dismiss()
    })
  }

  doInfinite(infiniteScroll) {
    if (this.totalPage <= this.currentPage) {
      infiniteScroll.complete();
      return
    }
    setTimeout(() => {
      this.apiServece.getData(this.loadUrl()+"?limit=15&page="+(this.currentPage+1), this.uuid, this.token).subscribe(resp => {
        resp.data.forEach(evaluate => {
          this.evaluates.push(evaluate)
        })
        this.currentPage = resp.current_page
        if (this.currentPage >= this.totalPage) infiniteScroll.enable(false)
        infiniteScroll.complete();
      }, err=>{
        infiniteScroll.complete();
      })
    }, 500);
  }

  openUserDetail(userId) {
    this.navCtrl.push(UserDetail, {id: userId})
  }

  openShop(id){
    this.navCtrl.push(Shop,{id:id});
  }

  openImages(images){
    this.navCtrl.push(PhotoSlidesPage,{images:images});
  }

  viewPost(evaluate){
    this.navCtrl.push(Evaluate,{evaluate: evaluate})
  }

  loadById(id) {
    this.loadId = id
    this.loadData()
    console.log(id)
  }

  presentPopover(myEvent) {
    // https://api2.shanghai-zine.com/api/pickups/name_list
    let popover = this.popoverCtrl.create(EditorPopoverPage, { pickupPage: this});
    popover.present(
    { ev: myEvent }
    );
  }
}
