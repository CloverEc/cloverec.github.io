import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { CategoriesData} from '../../providers/categories-data'

/**
 * Generated class for the Category page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shops-category',
  templateUrl: 'shops-category.html',
  providers: [CategoriesData]
})

export class ShopsCategory {
  public categories: any[]
  public subCategories: any[]

  constructor(
    private categoriesData: CategoriesData,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.categories = this.categoriesData.firstCategories()
    if (this.categories.length > 0) {
      this.subCategories = this.categoriesData.subCategoriesById(this.categories[0].id)
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Category');
  }

  getSubCategories(parentId) {
    this.subCategories = this.categoriesData.subCategoriesById(parentId)
  }

  filterByCateggory(category) {
    this.viewCtrl.dismiss()
    this.navParams.data.shops.cate = category.key
    this.navParams.data.shops.selectedCategory = category.val
    this.navParams.data.shops.loadShops()
  }
}
