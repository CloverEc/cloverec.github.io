import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { AreasData} from '../../providers/areas-data'

/**
 * Generated class for the Range page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-range',
  templateUrl: 'range.html',
  providers: [AreasData]
})
export class Range {
  public areas: any[]
  public subAreas: any[]
  public 

  constructor(
    private areasData: AreasData,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.areas = this.areasData.firstAreas()
    this.subAreas = this.areasData.sourcesData()[0].sub
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Range');
  }

  getSubAreas(parentId) {
    this.subAreas = this.areasData.subAreasById(parentId)
    console.log(this.subAreas)
  }

  filterByArea(area) {
    this.viewCtrl.dismiss();
    if (area.key == 500 || area.key == 1000 || area.key == 2000 || area.key == 10000) {
      this.navParams.data.shops.distance = area.key
      this.navParams.data.shops.area_id = null
      if (this.navParams.data.shops.sort == 2) {
        this.navParams.data.shops.sort = 0
        this.navParams.data.shops.selectedSort = "並び替え"
      }
    } else {
      this.navParams.data.shops.distance = null
      this.navParams.data.shops.area_id = area.key
    }
    this.navParams.data.shops.loadShops()
    this.navParams.data.shops.selectedRange = area.val
  }
}
