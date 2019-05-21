import { Component,Input, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'; 
import { ApiService} from '../../providers/api-service'
import { AlertController } from 'ionic-angular';
import { UserDetail } from '../user-detail/user-detail'; 
import { Login }  from '../login/login'
import { Shop }  from '../shop/shop'
import { Evaluate }  from '../evaluate/evaluate'
import { PhotoSlidesPage }  from '../photo-slides/photo-slides'
import { Storage } from '@ionic/storage'; 
import { Events } from 'ionic-angular'; 
import { EvaluatesSearch } from '../evaluates-search/evaluates-search'; 
import { EditorialDepartment } from '../editorial-department/editorial-department'; 

/**
 * Generated class for the Evaluates page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-evaluates',
  providers: [ApiService],
  templateUrl: 'evaluates.html',
})
export class Evaluates {
  @ViewChild('input') myInput;
  public evaluates: any[] = []
  public likeLoading:boolean[]
  public isMe:boolean
  public currentPage: number = 1
  public totalPage: number = 1
  public buttonClicked: boolean = false;
  public token:string
  public uuid:any
  public uid: number
  public recommend: string
  public urlParams:string
  public shopName
  public baseUrl: string = "/api/evaluates?limit=15"
  public searchWord: string
  public scrollEnable: boolean = false
  public isUser: boolean
  public isSearch: boolean = true
  list: string = "evaluateList";
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    private apiServece: ApiService,
    public events: Events,
    public alertCtrl: AlertController,
    public navParams: NavParams
  ) {
    // this.likeLoading = false
    this.isMe = false
    this.likeLoading = []
    this.readStorage()
    if (this.navParams.get("recommend") == true){
      this.recommend = 'true'
    }else{
      this.recommend = 'false'
    }
    this.isUser = false
    setTimeout(() => {
    if (this.navParams.get("type") === "user"){
      this.isUser = true
    }
      this.loadData()
    }, 500)
    this.searchWord = this.navParams.data.searchWord
    if (this.searchWord) this.baseUrl = "/api/search?limit=15&type=shop_evaluates&q="+this.searchWord
    if (this.searchWord) this.isSearch = false
    events.subscribe('evaluate:changed', (v) => {
      setTimeout(() => {
        this.loadData()
      }, 500)
    })
  }

  loadData() {
    let loader = this.loadingCtrl.create()
    loader.present()
    this.urlParams = ""
    let shop_id = this.navParams.get("shop_id")
    if (shop_id){
      this.urlParams = "&recommend=" + this.recommend +  "&shop_id=" + shop_id
    }
    if (this.navParams.get("type") == "user"){
      // this.checkLogin()
      this.isMe = true
      this.isSearch = false
      // if (this.recommend === 'true'){
      //   this.recommend = 'false'
      // }else{
      //   this.recommend = 'true'
      // }
      this.urlParams = "&recommend="  + this.recommend +  "&user_id=" + this.navParams.get("uid")
    }
    // evaluates?recommend=false&user_id=966&limit=15&page=1

    // this.apiServece.getData("/api/evaluates?limit=15&page=1" + this.urlParams).subscribe(resp => {
    //   console.log(resp)
    this.apiServece.getData(this.baseUrl+"&page=1" + this.urlParams, this.uuid, this.token).subscribe(resp => {
      resp.data.forEach((evaluate,i) => {
        this.evaluates.push(evaluate)
        this.likeLoading.push(false)
      })
      if (shop_id){
        this.shopName = this.evaluates[0].shop_name
      }
      this.currentPage = resp.current_page
      this.totalPage = resp.total_page
      this.totalPage > this.currentPage ? this.scrollEnable = true : this.scrollEnable = false
      loader.dismiss()
    }, err=>{
      console.error(err)
      loader.dismiss()
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Evaluates');
  }

  openUserDetail(userId) {
    this.navCtrl.push(UserDetail, {id: userId})
  }

  onComment(){
    this.buttonClicked = !this.buttonClicked;
    setTimeout(() => {
      this.myInput.setFocus();
    },150);
  }

  deleteEvaluate(evaluate){
    let actionSheet = this.actionSheetCtrl.create({
      title: '削除しますか？',
      buttons: [
        {
          text: 'はい',
          role: 'tel',
          handler: () => {
            // let loader = this.loadingCtrl.create()
            //   loader.present()
            this.apiServece.deleteData("/api/evaluates/" + evaluate.id, this.uuid, this.token).subscribe(resp => {
              setTimeout(()=>{
                this.evaluates = []
                this.loadData()
                if (this.navParams.get("type") === "user"){
                  setTimeout(() => {
                    this.loadData()
                    return false
                  }, 50)
                }
                // loader.dismiss()
                this.alertCtrl.create({subTitle: "口コミを削除致しました。", buttons: ['OK']}).present()
              },100)
            }, err=>{
              // loader.dismiss()
              this.alertCtrl.create({subTitle: err, buttons: ['OK']}).present()
              console.log(err)
            })
          }
        },{
          text: 'いいえ',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  doInfinite(infiniteScroll) { 
    if (this.currentPage >= this.totalPage) infiniteScroll.enable(false)
    setTimeout(() => {
      let reqUrl = this.baseUrl+"&page="+(this.currentPage+1) + this.urlParams
      this.apiServece.getData(reqUrl, this.uuid, this.token).subscribe(resp => {
        resp.data.forEach((evaluate,i) => {
        this.evaluates.push(evaluate)
        this.likeLoading.push(false)
        })
        this.currentPage = resp.current_page
        if (this.currentPage >= this.totalPage) this.scrollEnable = false
        infiniteScroll.complete();
      }, err=>{
        infiniteScroll.complete();
      })
    }, 500);
  }

  toggleLike(uid:number,i:number){
    this.likeLoading[i] = true
    this.isLogin()
    setTimeout(()=>{
      this.apiServece.putPromise(
        "/api/follow?type=shop_evaluates&follow_id=" + uid, this.uuid, this.token).then(resp => {
        this.evaluates.forEach((v,i)=>{
          if(v.id == uid){
            console.log(v)
            this.likeLoading[i] = false
            this.evaluates[i].likenum = resp.data[0].follower_num
          }
        })
      }).catch(err => {
        let e = JSON.parse(err._body)
        console.log(e)
        if (err.status === 401){
          this.navCtrl.setRoot(Login);
          this.likeLoading[i] = false
        }
      })
    },500)
  }
  isLogin(){
    if(!this.token){
    } 
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

  openSearch() {
    console.log("This is open search")
    this.navCtrl.push(EvaluatesSearch)
  }

  openEditorialDepartment() {
    console.log("#####")
    this.navCtrl.push(EditorialDepartment)
  }

  readStorage(){
    this.storage.get('uuid')
      .then((value) => {
        if (value){
          this.uuid = value
          this.storage.get('uid').then((value) => {
              if (value){
                this.uid = value
              }
          });
        }
      });
      this.storage.get('token').then((value) => {
        if (value){
          this.token = value
        }
      });
  }
  checkLogin(){
    console.log("checkLogin")
    this.apiServece.getData("/api/members/" + this.uid, this.uuid, this.token)
      .subscribe(data => {

        if (data.code == 200){
          console.log(data.data)
        }else{
          this.navCtrl.push(Login)
          return false
        }
      }, err=>{
        console.error(err)
        this.navCtrl.push(Login)
        return false
      });
  }
  onEvaluates(){
    this.evaluates = []
    this.recommend = 'false'
    this.loadData()
  }
  onRecommends(){
    this.evaluates = []
    this.recommend = 'true'
    this.loadData()

  }
}
