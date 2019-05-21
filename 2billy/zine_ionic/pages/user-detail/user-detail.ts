import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Shop } from '../shop/shop'; 
import { Utils} from '../../providers/utils'
import { Storage } from '@ionic/storage'
import { Login} from '../login/login';

/**
 * Generated class for the Inquiries page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-detail',
  providers: [ApiService, Utils],
  templateUrl: 'user-detail.html',
})
export class UserDetail {
  public evaluates: any[] = []
  public totalCount: number
  public currentPage: number = 1
  public totalPage: number = 1
  public currentUser: any
  public isCollect: boolean = false
  public token: string
  public uuid: string

  constructor(
    public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    private utils: Utils,
    private apiServece: ApiService,
    public events: Events,
    public storage: Storage,
    public navParams: NavParams
  ) {
    this.storage.get("token").then((val: any) => {
      this.token = val
    })
    this.storage.get("uuid").then((val: any) => {
      this.uuid = val
    })
    console.log(this.navParams.data)
    let loader = this.loadingCtrl.create()
     this.currentUser = {}
     this.currentUser.avatar = "/assets/images/blank_user.png"
    loader.present()
    setTimeout(()=>{
      this.apiServece.getData("/api/evaluates?recommend=false&user_id="+this.navParams.data.id+"&limit=15&page=1").subscribe(resp => {
        console.log(resp)
        resp.data.forEach(evaluate => {
          this.evaluates.push(evaluate)
        })
        this.totalCount = resp.se_count
          this.totalPage = resp.total_page
            loader.dismiss()
      }, err=>{
        loader.dismiss()
      })

      this.apiServece.getData("/api/members/"+this.navParams.data.id, this.uuid, this.token).subscribe(resp => {
        console.log(resp)
        this.currentUser = resp.data
        this.isCollect = resp.data.isCollect
      }, err=>{
      })
    },500)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Inquiries');
  }

  toggleFavorite() {
    let loader = this.loadingCtrl.create()
    loader.present()
    if (this.isCollect == false) {
      this.addFavorite(loader)
    } else {
      this.deleteFavorite(loader)
    }
  }

  addFavorite(loader) {
    this.apiServece.putData("/api/bookmarks?type=users&target_id="+this.currentUser.id, this.uuid, this.token).subscribe(resp => {
      this.isCollect = true
      loader.dismiss()
      this.utils.addToast()
      this.events.publish('bookmark_count:changed', {type: "users", count: 1});
    }, err => {
      loader.dismiss()
      if (err.status && err.status == 401) {
        this.navCtrl.setRoot(Login,{logout: true,menu: true}) 
      } else {
        this.utils.unknowToast()
      }
    })
  }

  deleteFavorite(loader) {
    console.log(this.uuid)
    this.apiServece.deleteData("/api/bookmarks?type=users&target_id="+this.currentUser.id, this.uuid, this.token).subscribe(resp => {
      this.isCollect = false
      loader.dismiss()
      this.utils.delToast()
      this.events.publish('bookmark_count:changed', {type: "users", count: -1});
    }, err => {
      loader.dismiss()
      this.utils.forHttp(err)
    })
  }

  openShop(shopId) {
    this.navCtrl.push(Shop, {id: shopId})
  }

  doInfinite(infiniteScroll) { 
    if (this.currentPage >= this.totalPage) {
      infiniteScroll.enable(false)
      return
    }
    setTimeout(() => {
     let reqUrl = "/api/evaluates?recommend=false&user_id="+this.navParams.data.id+"&limit=15&page="+(this.currentPage+1)
     this.apiServece.getData(reqUrl).subscribe(resp => {
        this.currentPage = resp.current_page
        resp.data.forEach(evaluate => {
          this.evaluates.push(evaluate)
        })
        infiniteScroll.complete();
        if (this.currentPage >= this.totalPage) infiniteScroll.enable(false)
      }, err=>{
        infiniteScroll.complete();
      })
    }, 500);
  }
}
