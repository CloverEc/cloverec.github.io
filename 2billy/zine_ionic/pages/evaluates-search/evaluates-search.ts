import { Component,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Shops } from '../shops/shops'; 
import { Searchbar } from 'ionic-angular';
import { Storage} from '@ionic/storage'
import { Evaluates } from '../evaluates/evaluates'; 

/**
 * Generated class for the Search page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-evaluates-search',
  templateUrl: 'evaluates-search.html',
})
export class EvaluatesSearch {
  public searchWord: string
  public searchItems: any[] = []
  public recordItems: any[] = []
  public currentPage: number = 1
  public totalPage: number
  public lat: number = 0
  public lng: number = 0
  public isScroll: boolean = false
  private showSearchResult = false
  public quickLinks: any[] = []
  @ViewChild(Searchbar) searchbar:Searchbar;


  constructor(
    private apiServece: ApiService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public storage: Storage,
    public navParams: NavParams
  ) {
    setTimeout(() => {
      this.searchbar.setFocus();
    })

    this.storage.get('evaluateItems').then((value: string[]) => {
      if (value) {
        this.recordItems = value
        console.log(this.searchItems)
      }
    })   
  }

  storageSearchItems(item: string) {
    this.storage.get('evaluateItems').then((value: string[]) => {
      let items = []
      if (value) {
        items = value
        items.push(item)
      } else {
        items.push(item)
      }
      var _items = []
      items.reverse().forEach(item => {
        if (_items.indexOf(item) < 0) {
          _items.push(item)
        }
      })
      this.storage.set("evaluateItems", _items);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Search');
  }

  openEvaluates(item) {
    this.navCtrl.push(Evaluates, {searchWord: item})
  }

  onClick(event) {
    this.searchItems = []
    this.isScroll = false
    this.showSearchResult = false
  }

  toSubmit(event) {
    let loader = this.loadingCtrl.create()
    if (typeof(event) == "string") {
      this.searchWord = event
    } else {
      this.searchWord = event.target.value
    }
    loader.present()
    this.showSearchResult = true
    // https://api2.shanghai-zine.com/api/search_name?q=B.B.&limit=15&page=1&type=shop_evaluates
    this.apiServece.getData("/api/search_name?q="+this.searchWord+"&limit=15&page=1&type=shop_evaluates").subscribe(resp => {
      resp.data.forEach(item => {
        this.searchItems.push(item)
      })
      this.currentPage = resp.current_page
      this.totalPage = resp.total_page
      if (this.currentPage >= this.totalPage) {
        this.isScroll = false
      } else {
        this.isScroll = true
      }
      loader.dismiss()
      if (this.searchWord != undefined || this.searchWord != "") {
        this.storageSearchItems(this.searchWord)
      }
    }, err=>{
      console.error(err)
      loader.dismiss()
    })
  }

  doInfinite(infiniteScroll) { 
    setTimeout(() => {
      this.currentPage += 1
      let url = "/api/search_name?q="+this.searchWord+"&limit=15&type=shop_evaluate&page="+this.currentPage
      this.apiServece.getData(url).subscribe(resp => {
        resp.data.forEach(item => {
          this.searchItems.push(item)
        })
        this.currentPage = resp.current_page
        this.totalPage = resp.total_page
        infiniteScroll.complete();
        if (this.currentPage >= this.totalPage) this.isScroll = false
      }, err=>{
        infiniteScroll.complete();
      })
    }, 500);
  }

  onInput(event: any) {
    console.log("onInput event fired.");
    console.log(event.target.value);
    this.showSearchResult = false
    let _items = []
    this.storage.get('recordItems').then((value: string[]) => {
      if (value) {
        value.forEach(item => {
          if (item.match(event.target.value)) {
            _items.push(item)
          }
        })
        this.recordItems = _items
      }
    })
  }

  onCancel(event: any) {
    console.log("onCancel event fired.");
  }

  onClear(event: any) {
    console.log("onClear event fired.");
    this.showSearchResult = false
    this.storage.get('recordItems').then((value: string[]) => {
      if (value) {
        this.recordItems = value
      }
    })
  }
}
