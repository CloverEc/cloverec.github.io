import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  ViewController, LoadingController,AlertController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import {Storage} from '@ionic/storage'; 
import { UserDetail } from '../user-detail/user-detail'; 

/**
 * Generated class for the UsersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-users',
  providers: [ApiService, Utils],
  templateUrl: 'users.html',
})
export class UsersPage {
  public users:any
  public page:number
  public uuid:any
  public token:any
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private apiServece: ApiService,
    private utils: Utils,
    public alertCtrl: AlertController,
    public storage: Storage,
    public navParams: NavParams
  ) {
    this.page = 1
      this.storage.get('token')
        .then((value) => {
          if (value){
            this.token = value
          } 
        });
    this.storage.get('uuid')
      .then((value) => {
        if (value){
          this.uuid = value
        } 
     });
     setTimeout(()=>{
       this.loadUsers()
     },1000)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }

  loadUsers(){
    let loader = this.loadingCtrl.create()
    loader.present()
    this.apiServece.getData("/api/bookmarks?type=users&page=" + this.page + "&limit=15",this.uuid, this.token).subscribe(resp => {
      console.log(resp.data)
      this.users = resp.data
      loader.dismiss()
    }, err=>{
      loader.dismiss()
      this.utils.forHttp(err)
    })
  }

  openUserDetail(userId){
    this.navCtrl.push(UserDetail, {id: userId})
  }

  doInfinite(infiniteScroll) { 
    this.page += 1
    let loader = this.loadingCtrl.create()
    loader.present()
    this.apiServece.getData("/api/bookmarks?type=users&page=" + this.page + "&limit=15",this.uuid, this.token).subscribe(resp => {
      if (resp.data.length > 0){
        this.users.push(resp.data)
      }
      loader.dismiss()
    }, err=>{
      loader.dismiss()
      this.alertCtrl.create({subTitle: this.apiServece.errTitle, buttons: ['OK']}).present()
    })
  }

  dropBookmark(user_id) {
    let confirm = this.alertCtrl.create({                                                                                           
      title: '削除しますか？',                                                                                                            
      message: '',                                                                                                                  
      buttons: [                                                                                                                    
        {                                                                                                                           
          text: '取消',                                                                                                             
          handler: () => {                                                                                                          
            console.log('Disagree clicked')                                                                                         
          }                                                                                                                         
        }, {
          text: '確認', 
          handler: () => {
            this.users.forEach((user, ind) => {                                                                               
              if(user.id == user_id){
                this.apiServece.deleteData("/api/bookmarks?type=users&target_id="+user_id, this.uuid, this.token).subscribe(resp => {
                  if (resp.code == 200) {
                    this.users.splice(ind, 1)
                    if (this.navParams.data.currentUser) {
                      this.navParams.data.currentUser.shops_cnt -= 1
                      console.log(this.navParams.data)
                    }
                  }
                }, err=>{
                })
              }
            })                                                                                                                      
          }                                                                                                                         
        }                                                                                                                           
      ]                                                                                                                             
    });                                                                                                                             
    confirm.present();
  }
}
