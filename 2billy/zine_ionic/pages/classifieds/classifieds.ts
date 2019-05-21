import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { ClassifiedPage } from '../classified/classified'; 
import { ClassifiedAdd } from '../classified-add/classified-add'; 
import { Login }  from '../login/login'
import { Storage } from '@ionic/storage'

/**
 * Generated class for the ClassifiedsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-classifieds',
  providers: [ApiService],
  templateUrl: 'classifieds.html',
})
export class ClassifiedsPage {
  data: any
  public posts: any[]
  public currentPage: number = 1
  public totalPage: number
  public cid: number = 99
  public uuid:string
  public uid:string
  public token:string
  public isLogin:boolean
  public scrollEnable: boolean = false
  public isLoad: boolean = false
  constructor(
    private apiServece: ApiService,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public navParams: NavParams
  ) {
    setTimeout(()=>{
      this.storage.get('uuid').then((value)=>{
        if (value){
          this.uuid = value
        }
      })
      this.storage.get('uid').then((value)=>{
        if (value){
          this.uid = value
        }
      })
      this.storage.get('token').then((value)=>{
        if (value){
          this.token = value
        }
      })
    },1)

    // this.data = [{
    //   content:' "<p class="MsoNormal"> ↵    オリジナルTシャツの作成を激安・高品質・短納期にて提供いたします。販売用のブランドTシャツ、会社キャンペーンTシャツ、チームやサークルのお揃いシャツ、文化祭で使うクラスTシャツなど幅広い用途でのご依頼に対応致します。個人の方と会社からの御注文とも承り、小ロットから大量依頼にも対応できます。お問い合わせメール：tia@t-shirt.sh <img src="/system/uploads/image/classifieds_15e868c9-1971-4c8d-b1ff-35e747212d2b.jpg" alt="http://shanghai-zine.com/" /> ↵</p> ',
    //   created_time: "2017.05.22",
    //   href: "/classifieds/1617",
    //   img: "/system/uploads/user/w104h104_4525.png",
    //   name:"Tia",
    //   title:"上海ベース、オリジナルＴシャツ専門会社",
    //   user_link: ""
    // }]
    this.loadData(this.cid)
  }

  loadData(cid) {
    let loader = this.loadingCtrl.create()
    loader.present()
    this.currentPage = 1
    this.apiServece.getData("/api/posts?cid="+cid).subscribe(resp => {
      resp.posts.forEach((v,i)=>{
       let color = this.category2color(v.bbs_category)
       resp.posts[i]["bbs_color"] = color
      })
      this.posts = resp.posts
      console.log(this.posts)
      this.totalPage = resp.total_pages
      this.totalPage > this.currentPage ? this.scrollEnable = true : this.scrollEnable = false
      loader.dismiss()
    }, err => {
      loader.dismiss()
      this.alertCtrl.create({subTitle: this.apiServece.errTitle, buttons: ['OK']}).present()
    })
  }

  doInfinite(infiniteScroll) { 
    setTimeout(() => {
      this.currentPage += 1
      this.apiServece.getData("/api/posts?cid="+this.cid+"&page="+this.currentPage).subscribe(resp => {
        resp.posts.forEach((v,i)=>{
          let color = this.category2color(v.bbs_category)
            resp.posts[i]["bbs_color"] = color
        })
        resp.posts.forEach((post) => {
          this.posts.push(post)
        })
        this.totalPage = resp.total_pages
        // this.currentPage = resp.current_page
        this.totalPage > this.currentPage ? this.scrollEnable = true : this.scrollEnable = false
        infiniteScroll.complete();
      }, err => {
        infiniteScroll.complete();
      })
    }, 500);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassifiedsPage');
  }

  openPost(id) {
    this.navCtrl.push(ClassifiedPage, {postId: id, postList: this})
  }

  removePost(id) {
    this.posts.forEach((post, ind) => {
      if (post.id == id) {
        this.posts.splice(ind, 1)
      }
    })
  }

  reloadData() {
    this.loadData(99)
  }

  openClassifieds(cid) {
    this.cid = cid
    this.loadData(cid)
  }

  addPost() {
    if (this.apiServece.isLogin()){
      this.navCtrl.push(ClassifiedAdd, {classifieds: this})
    } else {
      this.navCtrl.setRoot(Login,{logout: true,menu: true}) 
    }
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
          case '求職':
            color = "danger";
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
          case 'その他':
            color = "green";
           break;
          default:
            color = 'zine';
        }
    return color
 }
}
