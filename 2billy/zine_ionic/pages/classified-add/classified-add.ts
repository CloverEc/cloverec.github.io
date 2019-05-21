import { Component } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { Storage } from '@ionic/storage'
import { Camera,CameraOptions} from '@ionic-native/camera'; 
import { Headers,RequestOptions } from '@angular/http';
import { ActionSheetController } from 'ionic-angular'; 
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer'; 
import { Observable }     from 'rxjs/Observable'; 

/**
 * Generated class for the ClassifiedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-classified-add',
  providers: [ApiService, Utils],
  templateUrl: 'classified-add.html',
})

export class ClassifiedAdd {
  public post: any
  public uuid: string
  public step: boolean
  public isApp: boolean = false
  public token: string
  public categories: any[] = [["売ります", 3], ["買います", 4], ["住宅", 5], ["求人", 6], ["求職", 7], ["サークル", 8], ["友達募集", 11], ["イベント", 9], ["学ぶ", 10], ["ビジネス", 12]]
  // public field: {bbs_category_id?: number, title?: string, content?: string, email?: string, email_confirmation?: string, learn_rate?: string, sell_price?: string} = {}
  public field: any = {bbs_category_id: 3}

  constructor(
    private apiServece: ApiService,
    private utils: Utils,
    public platform: Platform,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public transfer: Transfer,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    public navParams: NavParams
  ) {
    this.storage.get('token').then((val)=>{
      this.token = val
    })
    this.storage.get('uuid').then((val)=>{
      this.uuid = val
    })
    this.isApp = false
    setTimeout(()=>{
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp = false
      }else{
        this.isApp = true
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassifiedPage');
  }

  submit() {
    console.log(this.field)
    // if (!this.field.title) {
    //   this.alertCtrl.create({
    //     subTitle: "ユーザを入力してください",
    //     buttons: ['OK']
    //   }).present();
    //   return false
    // }
    if (!this.field.bbs_category_id) {
      this.alertCtrl.create({
        subTitle: "カテゴリーを入力してください",
        buttons: ['OK']
      }).present();
      return false
    }
    if (!this.field.email) {
      this.alertCtrl.create({
        subTitle: "Emailを入力してください",
        buttons: ['OK']
      }).present();
      return false
    }
    if (this.field.email.match(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i) == null) {
      this.alertCtrl.create({
        subTitle: "Email形式を確認ください",
        buttons: ['OK']
      }).present();
      return false
    }
    if (this.field.email_confirmation != this.field.email) {
      this.alertCtrl.create({
        subTitle: "Email　確認用に入力してください",
        buttons: ['OK']
      }).present();
      return false
    }
    if (!this.field.content) {
      this.alertCtrl.create({
        subTitle: "内容を入力してください",
        buttons: ['OK']
      }).present();
      return false
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: '写真を投稿',
      buttons: [
        {
          text: '写真を選ぶ',
          role: 'tel',
          handler: () => {
            const options: CameraOptions = {
              quality: 80,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM ,
              targetWidth: 1224,
              targetHeight: 1632,
              correctOrientation: true
            }
            this.camera.getPicture(options).then((imageData) => {
              let headers = new Headers();
              headers.append('Authorization',  this.token);
              headers.append('Content-Md5', this.uuid);
              const fileTransfer: TransferObject = this.transfer.create();
              let options: FileUploadOptions = {
                fileKey: 'image',
                fileName: 'output.jpg',
                mimeType: 'image/*',
                httpMethod: "POST",
                headers: headers
              };
              options.params = this.field
              let loader = this.loadingCtrl.create({content: "読み込み中.."});
              loader.present();
              fileTransfer.upload(imageData,'https://api2.shanghai-zine.com/api/posts' , options, true)
                .then((data) => {
                  loader.dismiss();
                  let alert  = this.alertCtrl.create({
                    subTitle: "submit success",
                    buttons: ['OK']
                  })
                  alert.present();
                  alert.onDidDismiss(data => {
                    this.navCtrl.pop()
                    this.navParams.data.classifieds.reloadData()
                  })
                }, (err) => {
                  loader.dismiss();
                  console.error(err)
                })
            }, (err) => {
              alert(err)
              console.error(err)
            })
          }
        },{
          text: '写真なしで投稿',
          role: 'cancel',
          handler: () => {
            this.apiServece.postData("/api/posts", this.field, this.uuid, this.token).subscribe(resp => {
              let alert  = this.alertCtrl.create({
                subTitle: "投稿完了しました",
                buttons: ['OK']
              })
              alert.present();
              alert.onDidDismiss(data => {
                this.navCtrl.pop()
                this.navParams.data.classifieds.reloadData()
              })
            }, err => {
              console.log(err)
              this.alertCtrl.create({ 
                subTitle: "unknow err",
                buttons: ['OK']
              }).present();
            })
            console.log('Cancel clicked');
          }
        }
      ]
    });

    if (this.isApp){
      actionSheet.present();
    }else{
      this.step = true
    }

  }
  submitForm(){
    this.apiServece.postData("/api/posts", this.field, this.uuid, this.token).subscribe(resp => {
      let alert  = this.alertCtrl.create({
        subTitle: "投稿完了しました",
        buttons: ['OK']
      })
      alert.present();
      alert.onDidDismiss(data => {
        this.navCtrl.pop()
        this.navParams.data.classifieds.reloadData()
      })
    }, err => {
      console.log(err)
      this.alertCtrl.create({ 
        subTitle: "unknow err",
        buttons: ['OK']
      }).present();
    })
    console.log('Cancel clicked');
  }

  confirmAlart(shop_id){
    let confirm = this.alertCtrl.create({
      title: '投稿完了しました',
      message: 'ありがとうございます！',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // this.navCtrl.push(Shop,{id: shop_id })
          }
        }
      ]
    });
    confirm.present();
  }
  handleInputChange(event) {
    let files = event.target.files
    // for (let i = 0; i < files.length; i++) {
      this.makeFile('https://api2.shanghai-zine.com/api/posts' ,this.field,files[0]).subscribe(
        response  => { 
          
          console.log(response) },
        error =>  { console.log(error); }
      );
    // }
  }
  makeFile(url: string, params:any, file: File): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),
      xhr: XMLHttpRequest = new XMLHttpRequest();
      formData.append("image", file, file.name);
      for ( let key in params ) {
        formData.append(key, params[key]);
      } 
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
            // var date = new Date() 
            // this.dateTime =  date.getTime()
          } else {
            observer.error(xhr.response);
          }
            let msg = JSON.parse(xhr.response)
            this.alertCtrl.create({                                                                                                     
              subTitle: msg.message,
              buttons: ['OK']
            }).present();
            if (msg.message === 'success'){
              setTimeout(()=>{
                this.navCtrl.pop()
                this.navParams.data.classifieds.reloadData()
              },500)
            }
        }
      };

      xhr.upload.onprogress = (event) => {
        console.log(Math.round(event.loaded / event.total * 100))
        if (Math.round(event.loaded / event.total * 100) > 99){
        }
      };

      // xhr.upload.load 

      xhr.open('POST', url, true);
      // xhr.setRequestHeader(params)
      xhr.setRequestHeader('Authorization',  this.token);
      xhr.setRequestHeader('Content-Md5', this.uuid);
      xhr.setRequestHeader('Upload-Content-Type', 'image/*')
      // xhr.setRequestHeader('fileKey', 'images')
      xhr.send(formData);
    });
  }
}
