import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { SocialSharing } from '@ionic-native/social-sharing'; 
import { Storage } from '@ionic/storage'
import { UserDetail } from '../user-detail/user-detail'; 
import { ConsultPage } from '../classified-consult/classified-consult'; 
import { HomePage } from '../home/home'
import { Platform } from 'ionic-angular'; 
import { PhotoViewer } from '@ionic-native/photo-viewer'; 

declare let Wechat: any

/**
 * Generated class for the ClassifiedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-classified',
  providers: [ApiService, Utils],
  templateUrl: 'classified.html',
})
export class ClassifiedPage {
  public post: any = {}
  public isApp: boolean = false
  public content: string
  public comment: string
  public comments: any[] = []
  public token: string
  public uuid: string
  public uid: string
  public isAuthor: boolean = false
  public isLoad: boolean = false

  constructor(
    private apiServece: ApiService,
    private utils: Utils,
    private photoViewer: PhotoViewer,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navCtrl: NavController,
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
    this.storage.get('uuid').then((value)=>{
      this.uuid = value
    })
    this.storage.get('token').then((value)=>{
      this.token = value
    })
    this.storage.get("uid").then((val) => {
      this.uid = val
    })
    setTimeout(() => {
      this.loadData()
    }, 100)
  }

  loadData() {
     this.isLoad = false
     this.apiServece.getData("/api/posts/"+this.navParams.data.postId).subscribe(resp => {
       console.log(resp)
       this.post = resp.post
       this.content = this.post.content.replace(/\/system\/uploads\//g, "http://shanghai-zine.com/system/uploads/")
       this.comments = resp.comments
       console.log(this.uid == this.post.user_id)
       if (this.uid == this.post.user_id) this.isAuthor = true
       setTimeout(()=>{
         this.isLoad = true
       },800)
     }, err => {
       this.alertCtrl.create({subTitle: this.apiServece.errTitle, buttons: ['OK']}).present()
       this.isLoad = true
     })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassifiedPage');
  }

  openUserDetail(userId) {
    this.navCtrl.push(UserDetail, {id: userId})
  }

  submitComment() {
    if (this.comment == null || this.comment.length == 0) {
      this.alertCtrl.create({
        subTitle: "内容をお書きください",
        buttons: ['OK']
      }).present();
      return false
    }
    let loader = this.loadingCtrl.create()
    loader.present()
    this.apiServece.postData("/api/posts/"+this.post.id+"/comment", {content: this.comment}, this.uuid, this.token).subscribe(resp => {
      loader.dismiss()
      console.log(resp)
      this.comment = null
      this.alertCtrl.create({subTitle: 'Created successfully', buttons: ['OK']}).present()
      this.comments.push(resp.comment)
    }, err => {
      loader.dismiss()
      this.utils.forHttp(err)
    })
  }

  openConsult() {
    this.navCtrl.push(ConsultPage, {postId: this.post.id})
  }

  deleteBBS() {
    let confirm = this.alertCtrl.create({
      title: '',
      message: '削除しますか？', 
      buttons: [                                                                                                                    
        {                                                                                                                           
          text: '取消',                                                                                                             
          handler: () => {                                                                                                          
            console.log('Disagree clicked')                                                                                         
          }                                                                                                                         
        }, {
          text: 'OK',                                                                                                             
          handler: () => {                                                                                                          
            this.apiServece.deleteData("/api/posts/"+this.post.id, this.uuid, this.token).subscribe(resp => {
              this.navParams.data.postList.removePost(this.post.id)
              let alert = this.alertCtrl.create({
                subTitle: '削除しました', 
                buttons: ['OK']
              });
              alert.present();
              alert.onDidDismiss(data => {
                this.navCtrl.pop();
              });
            }, err => {
              this.utils.forHttp(err)
            })
          }
        }
      ]                                                                                                                             
    });  
    confirm.present();
  }

  shareWechat(session){
    if (session == 'SESSION'){
      Wechat.share({
        message: {
         title: this.post.title,
         description: this.post.title,
         thumb: this.post.user.avatar,
         media: {
           type: Wechat.Type.WEBPAGE,   // webpage
           webpageUrl: "http://m.shanghai-zine.com/tabs/t0/ホーム/classified/" + this.post.id   // webpage
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
          title: this.post.title,
          description: this.post.title,
          thumb: this.post.user.avatar,
          media: {
            type: Wechat.Type.WEBPAGE,   // webpage
            webpageUrl: "http://m.shanghai-zine.com/tabs/t0/ホーム/classified/" + this.post.id    // webpage
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

  openImage(img,title){
    this.photoViewer.show(img, title, {share: false}); 
  }

  shareSocial(){
    this.socialSharing.share(this.post.title  ,"", this.post.user.avatar, "http://m.shanghai-zine.com/tabs/t0/ホーム/classified/" + this.post.id ).then(() => {
      // Success!
      }).catch(() => {
      // Error!
    });
  }

  openHome(){
    this.navCtrl.setRoot(HomePage) 
  }
}
