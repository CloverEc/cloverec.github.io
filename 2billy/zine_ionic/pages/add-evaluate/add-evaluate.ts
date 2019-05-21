import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { LoadingController } from 'ionic-angular'; 
import { Platform,AlertController,MenuController } from 'ionic-angular';
import {Storage} from '@ionic/storage'
import {ImagePicker} from '@ionic-native/image-picker'; 
import { Observable }     from 'rxjs/Observable'; 
import { ActionSheetController } from 'ionic-angular'; 
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer'; 
import { Http, Headers, Request, Response, RequestOptions } from '@angular/http';
import {Shop} from '../shop/shop'
import {Events } from 'ionic-angular'

/**
 * Generated class for the AddEvaluatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-evaluate',
  providers: [ApiService],
  templateUrl: 'add-evaluate.html'
})
export class AddEvaluatePage {
  public evaluate_id:any
  public recommend:boolean
  public star:number[]
  public toDay:string
  public token:string
  public category: string
  public contributor: string
  public uid:number
  public uuid:any
  public step: boolean
  public isApp: boolean = false
  public dateTime: any
  constructor(
    public navCtrl: NavController,
    private apiServece: ApiService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public menuCtrl: MenuController,
    public storage: Storage,
    public events: Events,
    private imagePicker: ImagePicker,
    public transfer: Transfer,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams) {
    this.category = null
    this.step = false
    this.contributor = null
    this.readStorage()
    this.star = [0,0,0,0,0,0]
    this.recommend = this.navParams.get("recommend")
    this.toDay = new Date().toISOString();
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
    console.log('ionViewDidLoad AddEvaluatePage');
  }

  sendEevaluate(title,content,star,visit_date,contributor,category){
    let loader = this.loadingCtrl.create({
      content: "読み込み中..",
    });
    let rates = star[0].toString() + "," 
               + star[1].toString() + ","
               + star[3].toString() + ',' 
               + star[4].toString() + ',' 
               + star[5].toString() 
    loader.present();
    setTimeout(()=>{
    this.readStorage()
    if (this.recommend){
      rates = ''
    }
    this.apiServece.postData(
     "/api/evaluates",
     JSON.stringify({ content: content,
       rates: rates ,
       title: title ,
       visit_date: visit_date,
       recommend: this.recommend,
       contributor: contributor,
       category:  category,
       shop_id: this.navParams.get("shop_id")
     }),
     this.uuid,
     this.token)
     .subscribe(data => {
       console.error(data)
       loader.dismiss();
       this.evaluate_id = data.data[0].id
       let actionSheet = this.actionSheetCtrl.create({
         title: '投稿完了しました',
         buttons: [
           {
             text: '写真を投稿',
             role: 'tel',
             handler: () => {
               this.imagePicker.getPictures({maximumImagesCount: 10,quality: 75,width: 800}).then((results) => {
                 // for (var i = 0; i < results.length; i++) {
                 results.forEach((v,i)=>{ 
                   let headers = new Headers();
                   headers.append('Authorization',  this.token);
                   headers.append('Content-Md5', this.uuid);
                   const fileTransfer: TransferObject = this.transfer.create();
                   let options: FileUploadOptions = {
                     fileKey: 'images',
                     mimeType: 'image/*',
                     headers: headers
                   };
                   // options.params = {name:  this.userData.name} 

                   fileTransfer.upload(results[i],'https://api2.shanghai-zine.com/api/evaluates/' +  this.evaluate_id  + '/picture' , options,true)
                     .then((data) => {
                       // success
                       if (results[results.length-1] == results[i] ){
                         this.confirmAlart(this.navParams.get("shop_id"))
                         console.error(data)
                       }
                     }, (err) => {
                       // error
                       console.error(err)
                     })
                 })

               }, (err) => { });
             }
           },{
             text: '終了',
             role: 'cancel',
             handler: () => {
               this.confirmAlart(this.navParams.get("shop_id"))
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
     }, err=>{
       loader.dismiss();
       let message =  JSON.parse(err._body)
       let alert = this.alertCtrl.create({
         subTitle: message.error,
         buttons: ['OK']
       });
       alert.present();
     })
    },100)
  }


  confirmAlart(shop_id){
    let confirm = this.alertCtrl.create({
      title: '投稿完了しました',
      message: 'ありがとうございます！',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.events.publish('bookmark_count:changed', {type: "evaluate"});
            this.navCtrl.push(Shop,{id: shop_id })
          }
        }
      ]
    });
    setTimeout(()=>{
      confirm.present();
    },600)
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
    },0)
  }
  
  handleInputChange(event) {
    let files = event.target.files
    for (let i = 0; i < files.length; i++) {
      this.makeFile('https://api2.shanghai-zine.com/api/evaluates/' +  this.evaluate_id  + '/picture',{},files[i]).subscribe(
        response  => { console.log(response) },
        error =>  { console.log(error); }
      );
      if (files[files.length-1] == files[i] ){
        setTimeout(()=>{
          this.confirmAlart(this.navParams.get("shop_id"))
        },500)
      }
    }
  }
  makeFile(url: string, params:any, file: File): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();
        formData.append("images", file, file.name);
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
