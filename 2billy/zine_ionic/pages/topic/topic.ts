import { Component,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { Platform, Events} from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http'; 
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser'; 
import { SocialSharing } from '@ionic-native/social-sharing'; 
import { Content } from 'ionic-angular'; 
import { Storage } from '@ionic/storage'
import { Login} from '../login/login';
import { HomePage } from '../home/home'
declare let Wechat: any

/**
 * Generated class for the Topic page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-topic',
  providers: [ApiService, Utils],
  templateUrl: 'topic.html',
})
export class Topic {
  public isCollect: boolean = false
  public uuid: string
  public token: string
  public currentTopic: any
  public myVal: string
  public style_height: string
  public url: any
  public isApp: boolean
  public myHeight: string
  @ViewChild(Content) content: Content
  public myWidth: string
  public topic: {
    name?:string,
    s_image?: string,
    link?: string,
    latitude?: number,
    id?: number,
    longitude?: number,
    rates?: any
  } = {}
  public isLoad: boolean

  constructor(
    public navCtrl: NavController,
    private apiServece: ApiService,
    private utils: Utils,
    private platform: Platform,
    private http: Http,
    public storage: Storage,
    public events: Events,
    public  loadingCtrl: LoadingController,
    public  sanitizer: DomSanitizer,
    private socialSharing: SocialSharing,
    public  navParams: NavParams
  ) {
    this.isApp = false
    this.isLoad = false
    setTimeout(()=>{
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
      // if (this.platform.is('ios') || this.platform.is('android')){
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
    this.platform.ready().then((readySource) => {
      this.myHeight = this.platform.height() + "px"
      this.myWidth  = this.platform.width() + "px"
    });
    setTimeout(() => {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://shanghai-zine.com/device/topics/" + this.navParams.data.id )
      this.loadData()
      this.isLoad = true
    }, 800)
  }

  loadData() {
    this.isCollect = false
    this.apiServece.getData("/api/topics/"+this.navParams.data.id, this.uuid, this.token).subscribe(resp => {
      console.log(resp)
      this.topic.id    =this.navParams.data.id
      this.topic.name   = resp.data.title
      this.topic.s_image = resp.data.s_image
      this.topic.link = resp.data.web_link
      this.currentTopic = resp.data
      this.isCollect = resp.data.isCollect
      //loader.dismiss()
    }, err=>{
      console.error(err)
    //  loader.dismiss()
    })
  }

  shareWechat(session){
    if (session == 'SESSION'){
      Wechat.share({
        message: {
         title: this.topic.name,
         description: "",
         thumb: this.topic.s_image,
         media: {
           type: Wechat.Type.WEBPAGE,   // webpage
           webpageUrl: "http://m.shanghai-zine.com/nav/n4/topic/" + this.topic.id   // webpage
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
          title: this.topic.name,
          description: "",
          thumb: this.topic.s_image,
          media: {
            type: Wechat.Type.WEBPAGE,   // webpage
            webpageUrl: "http://m.shanghai-zine.com/nav/n4/topic/" + this.topic.id// webpage
          }
        },
        scene: Wechat.Scene.TIMELINE  // share to Timeline
      }, function () {
        alert("Success");
      }, function (reason) {
        alert("Failed: " + reason);
      })
    }
  }

  shareSocial(){
    this.socialSharing.share(this.topic.name ,"", this.topic.s_image,"http://m.shanghai-zine.com/nav/n4/topic/" + this.topic.id ).then(() => {
      // Success!
      }).catch(() => {
      // Error!
    });
  }

  onViewDidLoad() {
    console.log('ionViewDidLoad Topic');
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
    this.apiServece.putData("/api/bookmarks?type=topics&target_id="+this.currentTopic.id, this.uuid, this.token).subscribe(resp => {
      this.isCollect = true
      loader.dismiss()
      this.utils.addToast()
      this.events.publish('bookmark_count:changed', {type: "topics", count: 1});
    }, err => {
      loader.dismiss()
      this.utils.forHttp(err)
    })
  }

  deleteFavorite(loader) {
    this.apiServece.deleteData("/api/bookmarks?type=topics&target_id="+this.currentTopic.id, this.uuid, this.token).subscribe(resp => {
      this.isCollect = false
      loader.dismiss()
      this.utils.delToast()
      this.events.publish('bookmark_count:changed', {type: "topics", count: -1});
    }, err => {
      loader.dismiss()
      this.utils.forHttp(err)
    })
  }
  openHome(){
    this.navCtrl.setRoot(HomePage) 
  }
}
