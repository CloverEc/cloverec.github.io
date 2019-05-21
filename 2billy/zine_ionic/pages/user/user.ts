import { Component ,ViewChild} from '@angular/core';
import { App,IonicPage, NavController, NavParams,MenuController,Nav } from 'ionic-angular';
import { Platform,LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'; 
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { Camera, CameraOptions } from '@ionic-native/camera'; 
import { Crop } from '@ionic-native/crop'; 
import { ActionSheetController } from 'ionic-angular'; 
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer'; 
import { Observable }     from 'rxjs/Observable'; 
import { Http, Headers, Request, Response, RequestOptions } from '@angular/http';
import { Login } from '../login/login'
import { Sms } from '../sms/sms'
import { BindMobile } from '../bind-mobile/bind-mobile'
import { BindEmail } from '../bind-email/bind-email'
import {Events } from 'ionic-angular'
import CryptoJS from 'crypto-js';
declare let Wechat: any

/**
 * Generated class for the User page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  providers: [ApiService, Utils]
})
export class User {
  SECERET_KEY: string = 'xxxxx';// for billy
  public country: any
  public jobs: any[] = ["会社员", "自営業", "フリーランス", "学生", "主婦", "無職"]
  public interests: any[]= [ "映画鑑賞", "音楽鑑賞", "カラオケ・バンド", "スポーツ", "スポーツ観戦", "車・バイク", "旅行", "語学", "読書", "バーチャル", "まんが・アニメ", "ゲーム", "料理", "お酒", "ギャンブル", "ショッピング", "ファッション", "アウトドア", "アート", "ペット"]
  public addresses: any[] = ["中国（香港、マカオ、台湾を含まない）", "日本", "その他"]
  public liveTimes: any[] = [
    [1, '在住〜1年'],
    [2, '1年〜3年'],
    [3, '3年〜5年'],
    [4, '5年以上'],                                                                                                              
    [5, '旅行者'],
    [6, '出張者'],
    [7, '元在住者']
  ]
  @ViewChild(Nav) nav: Nav;
  public isUpload:boolean
  public isApp:boolean
  userData: 
  {
    address?: string,
    password?: string,
    avatar?: string,
    birthday?: string,
    country?: string,
    gender?: string,
    id?: number,
    interest?: string,
    isCollect?: boolean,
    islike?: boolean,
    job?: string,
    likenum?: number,
    live_china?: string,
    name?: string,
    se_count?: number,
    sei_count?: number,
    self_introduction?: string,
    telphone?: string,
    wechat_avatar?: string,
    image?: any,
    wechat_id?: string
  } = {}
   token: string
   uid: string
   uuid: string
   dateTime: any
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public appCtrl: App,
    public menuCtrl: MenuController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public camera: Camera,
    public crop: Crop,
    public alertCtrl: AlertController, 
    public transfer: Transfer,
    public events: Events,
    private _http: Http,
    private utils: Utils,
    private apiService: ApiService
  ) {
    var date = new Date() ;
    this.dateTime =  date.getTime()
    this.country = ["日本", "中国", "香港", "台湾", "アイスランド", "アイルランド", "アゼルバイジャン ", "アフガニスタン", "アメリカ合衆国", "アラブ首長国連邦", "アルジェリア", "アルゼンチン", "アルバ ", "アルバニア", "アルメニア", "アンギラ", "アンゴラ", "アンティグア・バーブーダ", "アンドラ", "イエメン", "イギリス", "イスラエル", "イタリア", "イラク", "イラン", "インド", "インドネシア", "ウガンダ", "ウクライナ", "ウズベキスタン", "ウルグアイ", "エクアドル", "エジプト", "エストニア", "エチオピア", "エリトリア", "エルサルバドル", "オーストラリア", "オーストリア", "オマーン", "オランダ", "オランダ領アンティル", "ガーナ", "カーボベルデ", "ガイアナ", "カザフスタン", "カタール", "カナダ", "ガボン", "カメルーン", "ガンビア", "カンボジア", "ギニア", "ギニアビサウ", "キプロス", "キューバ", "ギリシャ", "キリバス", "キルギス", "グアテマラ", "グアドループ", "グアム", "クウェート", "クック諸島", "グリーンランド", "クリスマス島", "グルジア", "グレナダ", "クロアチア", "ケイマン諸島", "ケニア", "コートジボワール", "ココス諸島", "コスタリカ", "コモロ", "コロンビア", "コンゴ共和国", "コンゴ民主共和国", "サウジアラビア", "サウスジョージア・サウスサンドウィッチ諸島", "サモア", "サントメ・プリンシペ", "ザンビア", "サンピエール・ミクロン", "サンマリノ", "シエラレオネ", "ジブチ", "ジブラルタル", "ジャマイカ", "シリア", "シンガポールンバブエ", "スイスウェーデン", "スーダン", "スバールバル諸島・ヤンマイエン島ペイン", "スリナムリランカ", "スロバキア", "スロベニア", "スワジランド", "セイシェル", "セネガル", "セルビア・モンテネグロ", "セントクリストファー・ネイビス", "セントビンセントおよびグレナディーン諸島", "セントヘレナ", "セントルシア", "その他の米領諸島", "ソマリア", "ソロモン諸島", "タークス諸島・カイコス諸島", "タイ", "タジキスタン", "タンザニア", "チェコ共和国", "チャド", "チュニジア", "チリ", "ツバル", "デンマーク", "ドイツ", "トーゴ", "トケラウ諸島", "ドミニカ共和国", "ドミニカ国", "トリニダード・トバゴ", "トルクメニスタン", "トルコ", "トンガ", "ナイジェリア", "ナウル", "ナミビア", "ニウエ", "ニカラグア", "ニジェール", "ニューカレドニア", "ニュージーランド", "ネパール", "ノーフォーク島", "ノルウェー", "バージン諸島", "ハード・マクドナルド諸島", "バーレーン", "ハイチ", "パキスタン", "バチカン", "パナマ", "バヌアツ", "バハマ", "パプアニューギニア", "バミューダ諸島", "パラオ", "パラグアイ", "バルバドス", "ハンガリー", "バングラデシュ", "ピトケアン", "フィジー諸島", "フィリピン", "フィンランド", "ブータン", "ブーベ島", "プエルトリコ", "フェロー諸島", "フォークランド・マルビナス諸島", "ブラジル", "フランス", "フランス領ギアナ", "フランス領ポリネシア", "フランス領南極地方", "ブルガリア", "ブルキナファソ", "ブルネイ", "ブルンジ", "ベトナム", "ベナン", "ベネズエラ", "ベラルーシ", "ベリーズ", "ペルー", "ベルギー", "ポーランド", "ボスニア・ヘルツェゴビナ", "ボツワナ", "ボリビア", "ポルトガル", "ホンジュラス", "マーシャル諸島", "マイヨット島", "マカオ", "マケドニア、旧ユーゴスラビア共和国", "マダガスカル", "マラウイ", "マリ", "マルタ", "マルチニーク島", "マレーシア", "ミクロネシア", "ミャンマー", "メキシコ", "モーリシャス", "モーリタニアザンビーク", "モナコルディブ", "モルドバ", "モロッコ", "モンゴル", "モンセラット", "ヨルダン", "ラオス", "ラトビア", "リトアニアビア", "リヒテンシュタイン", "リベリア", "ルーマニア", "ルクセンブルグ", "ルワンダ ", "レソト", "レバノン", "レユニオン", "ロシア", "ワリス・フテュナ諸島", "英領インド洋地域", "英領バージン諸島", "韓国", "中央アフリカ共和国", "東ティモール", "南アフリカ", "米領サモア", "北マリアナ諸島"]
    this.isUpload = false
    this.isApp = false
    this.userData.avatar = "/assets/images/blank_user.png"
    setTimeout(()=>{
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp = false
      }else{
        this.isApp = true
      }
    })
      
      this.storage.get('token')
        .then((value) => {
          if (value){
            this.token = value
          }else{
            this.navCtrl.setRoot(Login);
          }
        });
     

        this.storage.get('uuid')
          .then((value) => {
            if (value){
              this.uuid = value
            }
          });
    
    this.storage.get('uid')
      .then((value) => {
        if(value){
          this.uid = value
          this.loadData()
        }else{
            // this.navCtrl.push(Login)            
        }       
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad User');
  }

  openMenu() {
    this.menuCtrl.open();
  }

  openSms() {
    this.navCtrl.push(Sms)
  }

  onSave(d:any){
    setTimeout(() => {
      // putData(url:string, uuid?:any, token?:string, params?:any): Observable<any>{
      let loader = this.loadingCtrl.create();
      loader.present()
      this.apiService.putData("/api/members",this.uuid,this.token,d).subscribe(resp => {
        loader.dismiss()
        if (resp.code == 200) {
          let cipherPassword = CryptoJS.AES.encrypt(this.userData.password, this.SECERET_KEY);
          if (this.userData.password) {
            this.storage.set("password", cipherPassword.toString())
          }
          this.loadData()
          this.events.publish('user:changed', 'change');
          this.alertCtrl.create({
            subTitle: '保存しました',
            buttons: ['OK']
          }).present();
        }
      }, err => {
        this.utils.forHttp(err)
        loader.dismiss();                                                                                                           
      });
    }, 100)
  }

  photolibraryCapture(){
    if (!this.isApp){
      this.isUpload = true
    }
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
      // console.error(imageData)
      this.crop.crop(imageData, {quality: 75})
        .then(
          newImage => {
             let headers = new Headers();
             // headers.append('Conten=t-Type', 'application/json');
             headers.append('Authorization',  this.token);
             headers.append('Content-Md5', this.uuid);
             const fileTransfer: TransferObject = this.transfer.create();
             let options: FileUploadOptions = {
               fileKey: 'image',
               fileName: 'output' + this.dateTime +   '.jpg',
               mimeType: 'image/*',
               httpMethod: "PUT",
               headers: headers
             };
             options.params = {name:  this.userData.name} 
             fileTransfer.upload(newImage,'https://api2.shanghai-zine.com/api/members' , options,true)
             .then((data) => {
               // success
               var date = new Date() ;
               this.dateTime =  date.getTime()
               this.loadData()
               this.events.publish('user:changed', 'change');
                 console.error(data)
               }, (err) => {
                 // error
                 console.error(err)
               })
         }, error => console.error('Error cropping image', error)
      );
    }, (err) => {
      // alert(err)
      console.error(err)
    })
  }

  loadData(){
    setTimeout(() => {
      let loader = this.loadingCtrl.create();
      loader.present()
      this.apiService.getData("/api/members/"+this.uid, this.uuid, this.token)
        .subscribe(data => {
          loader.dismiss()
          console.log(data.data)
          this.userData = data.data
            this.liveTimes.forEach((t) => {
              if (t[1] == this.userData.live_china) {
                this.userData.live_china = t[0]
              }
            })
            if (this.userData.gender == "男")  this.userData.gender = '1'
              if (this.userData.gender == "女")  this.userData.gender = '0'
                this.storage.get('password').then((value)=>{
                  if (value){
                    let decodePassword = CryptoJS.AES.decrypt(value,this.SECERET_KEY)
                      this.userData.password = decodePassword.toString(CryptoJS.enc.Utf8)
                  }
                })
                console.log(this.userData)
        }, err=>{
          console.error(err)
          loader.dismiss()
        })
    },500)
  }

  bindMobile() {
    this.navCtrl.push(BindMobile, {currentUser: this.userData})
  }

  bindEmail() {
    this.navCtrl.push(BindEmail, {currentUser: this.userData})
  }

  openWechat() {
    if (this.userData.wechat_id){
      let actionSheet = this.actionSheetCtrl.create({
        title: '解除しますか',
        buttons: [
          {
            text: 'はい',
            role: 'ok',
            handler: () => {
              let loader = this.loadingCtrl.create();
              loader.present()
              this.apiService.deleteData("/api/bind_wechat_user?user_id="+this.uid, this.uuid, this.token)
                .subscribe(data => {
                  this.loadData()
                  loader.dismiss()
                },(err)=>{
                  console.error(err)
                  if (err._body){
                    let msg:any  =  JSON.parse(err._body)
                      this.alertCtrl.create({
                        subTitle: msg.error,
                        buttons: ['OK']
                      }).present();
                  }
                  loader.dismiss()
                })
            }
          },{
            text: 'キャンセル',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }else{
      let actionSheet = this.actionSheetCtrl.create({
        title: 'WeChatと紐付ける',
        buttons: [
          {
            text: 'はい',
            role: 'ok',
            handler: () => {
              let loader = this.loadingCtrl.create({
                content: "読み込み中..",
              });
              loader.present();
              setTimeout(()=>{
                this.events.publish('wechat_user:changed', "uid");
                loader.dismiss();
              },9000)

              setTimeout(()=>{
                this.loadData()
              },10000)
              var scope = "snsapi_userinfo", state = "_" + (+new Date());
              Wechat.auth(scope, state, function (response) {
                window.localStorage.setItem("code",response.code)
              }, function (reason) {
                console.log("Failed: " + reason);
              })
            }
          },{
            text: 'キャンセル',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  handleInputChange(event) {
    let headers = new Headers();
    headers.append('Authorization',  this.token);
    headers.append('Content-Md5', this.uuid);
    headers.append('Upload-Content-Type', 'image/*')
    let files = event.target.files
    let options = new RequestOptions({
      body: {
        fileKey: 'image',
        fileName: 'output' + this.dateTime +   '.jpg',
        mimeType: 'image/*',
       'content-type': 'image/jpg',
        httpMethod: "PUT"
      },
      headers: headers
    })

    this.makeFile('https://api2.shanghai-zine.com/api/members', options,files[0]).subscribe(
      response  => { console.log(response) },
      error =>  { console.log(error); }
    );
  }


  

  makeFile(url: string, params:any, file: File): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();

      // for (let i = 0; i < files.length; i++) {
        formData.append("image", file, file.name);
      // }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
          var date = new Date() 
            this.dateTime =  date.getTime()
              setTimeout(()=>{
                this.isUpload = false
                  this.events.publish('user:changed', 'change');
                this.loadData()
           },500)
        }
      };

      xhr.upload.onprogress = (event) => {
        console.log(Math.round(event.loaded / event.total * 100))
        if (Math.round(event.loaded / event.total * 100) > 99){
        }
      };

      // xhr.upload.load 

      xhr.open('PUT', url, true);
      // xhr.setRequestHeader(params)
      xhr.setRequestHeader('Authorization',  this.token);
      xhr.setRequestHeader('Content-Md5', this.uuid);
      xhr.setRequestHeader('Upload-Content-Type', 'image/*')
      xhr.send(formData);
    });
  }

}
