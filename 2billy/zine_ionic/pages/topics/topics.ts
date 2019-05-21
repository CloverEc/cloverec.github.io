import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Utils} from '../../providers/utils'
import { Topic } from '../topic/topic'; 
import { Storage} from '@ionic/storage'; 

/**
 * Generated class for the Topics page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-topics',
  providers: [Utils],
  templateUrl: 'topics.html',
})
export class Topics {
  public topics: any[]
  public currentPage: number = 1
  public totalPage: number
  public category: string = "0"
  public subCategory: string = "0"
  public baseUrl: string = "/api/topics?limit=15"
  public type: string
  public uid:number 
  public uuid:string
  public token:string
  public isMember: boolean = false
  public scrollEnable: boolean

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private apiServece: ApiService,
    private utils: Utils,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams
  ) {
    this.token = ""
    this.uuid  = ""
    setTimeout(() => {
      this.storage.get('uuid')
        .then((value) => {
          if (value){
            this.uuid = value
          }
        });
      this.storage.get('token')
        .then((value) => {
          if (value){
            this.token = value
          }
        });
    },0)
    setTimeout(() => {
    if (this.navParams.data.isMember) {
      this.isMember = this.navParams.data.isMember
      this.baseUrl = "/api/bookmarks?type=topics&limit=15"
    }
    },10)
  }

  ionViewDidLoad() {
    setTimeout(()=>{
      this.uid = this.navParams.data.uid
      console.log(this.uid)
      this.loadTopics(this.uid)
    },1000)
  }

  loadUrl(uid?:number): string {
    var url: string
    url = this.baseUrl+"&page="+this.currentPage
    if (this.category == "0" || this.category == "new") {
      if (this.isMember) {
        if (this.type) url += ("&type_id="+this.type)
      } else {
        if (this.type) url += ("&type="+this.type)
      }
    } else {
      if (this.isMember) {
        url += ("&type_id="+this.category)
      } else {
        url += ("&type="+this.category)
      }
    }
    return url
  }

  loadTopics(uid?: number) {
    let loader = this.loadingCtrl.create()
    loader.present()
    this.topics = []
    this.currentPage = 1
    this.apiServece.getData(this.loadUrl(uid),this.uuid, this.token).subscribe(resp => {
      resp.data.forEach(topic => {
        this.topics.push(topic)
      })
      this.currentPage = resp.current_page
      this.totalPage = resp.total_page
      this.totalPage > this.currentPage ? this.scrollEnable = true : this.scrollEnable = false
      loader.dismiss()
    }, err=>{
      loader.dismiss()
      this.utils.forHttp(err)
    })
  }

  categoryChange(ev) {
    if (this.category == "new") {
      this.type = "2"
      if (this.isMember) {
        this.baseUrl = "/api/bookmarks?type=news&limit=15"
      } else {
        this.baseUrl = "/api/news?limit=15"
      }
    } else {
      this.type = null
      if (this.isMember) {
        this.baseUrl = "/api/bookmarks?type=topics&limit=15"
      } else {
        this.baseUrl = "/api/topics?limit=15"
      }
    }
    this.loadTopics()
  }

  subCategoryChange(ev) {
    console.log(ev)
    this.loadTopics()
  }

  openTopic(topicId) {
    this.navCtrl.push(Topic, {id: topicId})
  }

  deleteTopic(selectedTopic, slidingItem) {
    let confirm = this.alertCtrl.create({                                                                                           
      title: '删除确认',                                                                                                            
      message: '',                                                                                                                  
      buttons: [                                                                                                                    
        {                                                                                                                           
          text: '取消',                                                                                                             
          handler: () => {                                                                                                          
            console.log('Disagree clicked')                                                                                         
          }                                                                                                                         
        }, {
          text: '确认', 
          handler: () => {
            this.topics.forEach((topic, ind) => {                                                                               
              if(topic == selectedTopic){
                this.apiServece.deleteData("/api/bookmarks?type=topics&target_id="+selectedTopic.id, this.uuid, this.token).subscribe(resp => {
                  if (resp.code == 200) {
                    this.topics.splice(ind, 1)
                    this.navParams.data.currentUser.topics_cnt -= 1
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

  doInfinite(infiniteScroll) { 
    setTimeout(() => {
      this.currentPage += 1
      this.apiServece.getData(this.loadUrl(), this.uuid, this.token).subscribe(resp => {
        this.currentPage = resp.current_page
        this.totalPage = resp.total_page
        resp.data.forEach(topic => {
          this.topics.push(topic)
        })
        infiniteScroll.complete();
        this.totalPage > this.currentPage ? this.scrollEnable = true : this.scrollEnable = false
      }, err=>{
        infiniteScroll.complete();
      })
    }, 500);
  }
}
