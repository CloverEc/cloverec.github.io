import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Platform,LoadingController } from 'ionic-angular'; 
import { AreasData} from '../../providers/areas-data'
import { TagsData} from '../../providers/tags-data'
import { CategoriesData} from '../../providers/categories-data'
import { ApiService} from '../../providers/api-service'
import { Storage } from '@ionic/storage'; 
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer'; 
import { Headers,RequestOptions } from '@angular/http';
import { Camera,CameraOptions} from '@ionic-native/camera'; 
import { ActionSheetController } from 'ionic-angular'; 
import { Observable }     from 'rxjs/Observable'; 
/**
 * Generated class for the AddShop page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-shop',
  templateUrl: 'add-shop.html',
  providers: [AreasData, CategoriesData, ApiService, TagsData]
})
export class AddShop {
  public storeField:any = {}
  public dependentColumns: any[] = []
  public categoryColumns: any[] = []
  public tagColumns: any[] = []
  public isCategoryChange: boolean = false
  public isAreaChange: boolean = false
  public token: string
  public uuid: string
  public uid: string
  public isApp:boolean
  public step:boolean = false
  constructor(
    public navCtrl: NavController,
    private areasData: AreasData,
    private tagsData: TagsData,
    private apiServece: ApiService,
    private categoriesData: CategoriesData,
    public alertCtrl: AlertController, 
    public storage: Storage,
    private camera: Camera,
    public transfer: Transfer,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams
  ) {
    this.isApp = false
    setTimeout(()=>{
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp = false
      }else{
        this.isApp = true
      }
    })
    this.storage.get("token").then((val) => {
      this.token = val
    })
    this.storage.get("uuid").then((val) => {
      this.uuid = val
    })
    this.storage.get("uid").then((val) => {
      this.uid = val
    })
    this.storeField = {}
    // this.storeField = {
    //   name: "",
    //   note: "",
    //   cn_name: "",
    //   pinyin: "",
    //   first_category_id: "",
    //   second_category_id: "",
    //   category_id: "",
    //   area_id: "",
    //   first_area_id: "",
    //   second_area_id: "",
    //   tel: "",
    //   per_spend: "",
    //   business_hours: "",
    //   tag: "",
    //   image: ""
    // }

    this.categoryColumns = [
      {
        columnWidth: '100px', 
        options: this.categoriesData.firstCategoriesForPicker()
      },{
        columnWidth: '100px', 
        options: this.categoriesData.secondCategoriesForPicker()
      }, {
        columnWidth: '100px', 
        options: this.categoriesData.thirdCategoriesForPicker()
      }
    ]

    this.dependentColumns = [
      {
        columnWidth: '100px', 
        options: this.areasData.firstAreasForPicker()
      },{
        columnWidth: '100px', 
        options: this.areasData.secondAreas()
      }, {
        columnWidth: '100px', 
        options: this.areasData.thirdAreas()
      }
    ]

    this.tagColumns = this.tagsData.sourcesData()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddShop');
  }

  submitForm() {
    let fal = false
    if (this.storeField.name == undefined || this.storeField.name.length == 0) {
      fal = true
      this.alertCtrl.create({                                                                                                     
        title: 'メッセージ',
        subTitle: "店舗名を記載してください",
        buttons: ['OK']
      }).present();
      return false
    }

    if (this.storeField.note == undefined || this.storeField.note.length == 0) {
      fal = true
      this.alertCtrl.create({                                                                                                     
        title: 'メッセージ',
        subTitle: "詳細を記載してください",
        buttons: ['OK']
      }).present();
      return false
    }

    if (this.isCategoryChange != true) {
      fal = true
      this.alertCtrl.create({                                                                                                     
        title: 'メッセージ',
        subTitle: "category選択してください",
        buttons: ['OK']
      }).present();
      return false
    }

    if (this.isAreaChange != true) {
      fal = true
      this.alertCtrl.create({                                                                                                     
        title: 'メッセージ',
        subTitle: "area選択してください",
        buttons: ['OK']
      }).present();
      return false
    }


    if (fal) {
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
              // headers.append('Conten=t-Type', 'application/json');
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
              options.params = this.storeField
                let loader = this.loadingCtrl.create({
                  content: "読み込み中..",
                });
                loader.present();
              fileTransfer.upload(imageData,'https://api2.shanghai-zine.com/api/additional_shops' , options,true)
                .then((data) => {
                  // success
                  loader.dismiss();
                  console.error(data)
                }, (err) => {
                  // error
                  loader.dismiss();
                  console.error(err)
                })
            }, (err) => {
              alert(err)
              console.error(err)
            })
            // }, (err) => { });
          }
        },{
          text: '写真なしで投稿',
          role: 'cancel',
          handler: () => {
            this.apiServece.postData("/api/additional_shops", this.storeField, this.uuid, this.token).subscribe(resp => {
              console.log(resp)
              this.alertCtrl.create({
                subTitle: "submit success",
                buttons: ['OK']
              }).present();
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



  categoryChange(ev) {
    this.isCategoryChange = true
    if (ev[0]) {
      this.storeField.first_category_id = ev[0].value
    }
    if (ev[1]) {
      this.storeField.second_category_id = ev[1].value
    }
    if (ev[2]) {
      this.storeField.category_id = ev[2].value
    }
    console.log(this.storeField)
  }

  areaChange(ev) {
    this.isAreaChange = true
    if (ev[0]) {
      this.storeField.first_area_id = ev[0].value
    }
    if (ev[1]) {
      this.storeField.second_area_id = ev[1].value
    }
    if (ev[2]) {
      this.storeField.area_id = ev[2].value
    }
    console.log(this.storeField)
  }
  handleInputChange(event) {
    let files = event.target.files
    // for (let i = 0; i < files.length; i++) {
      this.makeFile('https://api2.shanghai-zine.com/api/additional_shops',this.storeField,files[0]).subscribe(
        response  => { 
          setTimeout(()=>{
            this.navCtrl.pop()
          },500)
          console.log(response) 
        },
        error =>  { console.log(error); }
      );
  }
  makeFile(url: string, params:any, file: File): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();
        for ( let key in params ) {
          formData.append(key, params[key]);
        } 
       formData.append("image", file, file.name);
       // formData.append('fileKey', 'image')
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
            // var date = new Date() 
            // this.dateTime =  date.getTime()
          } else {
            observer.error(xhr.response);
            let msg = JSON.parse(xhr.response)
            this.alertCtrl.create({                                                                                                     
              subTitle: msg.message,
              buttons: ['OK']
            }).present();
            if (msg.message === 'success'){
              setTimeout(()=>{
                this.navCtrl.pop()
              },500)
            
            }else{
              this.step = false
            }
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
      // xhr.setRequestHeader("Content-type", "application/json; charset=utf-8")
      // xmlhttp.setRequestHeader("Content-type", "multipart/form-data");
      xhr.setRequestHeader('Authorization',  this.token);
      xhr.setRequestHeader('Content-Md5', this.uuid);
      // xhr.setRequestHeader('Upload-Content-Type', 'image#<{(|')
      xhr.send(formData);
    });
  }

  submit(){
    this.apiServece.postData("/api/additional_shops", this.storeField, this.uuid, this.token).subscribe(resp => {
      console.log(resp)
      this.alertCtrl.create({
        subTitle: "submit success",
        buttons: ['OK']
      }).present();
      this.navCtrl.pop()
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
