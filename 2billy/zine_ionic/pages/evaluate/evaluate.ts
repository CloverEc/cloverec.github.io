import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,MenuController,LoadingController } from 'ionic-angular';
// import { ImagePicker } from '@ionic-native/image-picker'; 
import { ApiService} from '../../providers/api-service'
import { Storage } from '@ionic/storage'; 
import { Events } from 'ionic-angular'; 
/**
 * Generated class for the Evaluate page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-evaluate',
  providers: [ApiService],
  templateUrl: 'evaluate.html',
})
export class Evaluate {
  public evaluate:any
  public uuid:any
  public uid:any
  public token:any
  public username: string
  constructor(
    public navCtrl: NavController,
    // private imagePicker: ImagePicker,
    public storage: Storage,
    private apiServece: ApiService,
    public loadingCtrl: LoadingController,
    public events: Events,
    public alertCtrl: AlertController,
    public navParams: NavParams) {
    this.readStorage()
    this.evaluate = this.navParams.data.evaluate
    console.log(this.evaluate)
  }

  ionViewDidLoad() {
      setTimeout(()=>{
      },100)
    console.log('ionViewDidLoad Evaluate');
  }

  // uploadImage(){
  //   this.imagePicker.getPictures({maximumImagesCount: 10,quality: 75,width: 800}).then((results) => {
  //     for (var i = 0; i < results.length; i++) {
  //       console.error('Image URI: ' + results[i]);
  //     }
  //   }, (err) => { });
  // }
  
  postComment(id,content){
    setTimeout(()=>{
      let loader = this.loadingCtrl.create({
        content: "読み込み中..",
      });
      loader.present();
      this.apiServece.postData("/api/evaluates/" + id +  "/comments",
        JSON.stringify({content: content}),
        this.uuid,
        this.token)
        .subscribe(data => {
          this.events.publish('evaluate:changed', "reload");
          this.evaluate.shop_comments.push({comment_content: content,comment_user_id: this.uid,comment_user_name: this.username})
          loader.dismiss();
        }, err=>{
          let message =  JSON.parse(err._body)
          let alert = this.alertCtrl.create({
            subTitle: message.error,
            buttons: ['OK']
          });
          alert.present();
          loader.dismiss();
        })
    },0)
  }

  readStorage(){
    setTimeout(()=>{
      this.storage.get('uuid').then((value)=>{
        if (value){
          this.uuid = value
        }
      })
      this.storage.get('token')
        .then((value) => {
          if (value){
            this.token = value
              this.storage.get('uid')
                .then((value) => {
                  if (value){
                    this.uid = value
                  }
           });
          }
        });
      this.storage.get('name').then((value) => { 
        if (value){
          this.username = value
        }
      })
    },1)
  }
}
