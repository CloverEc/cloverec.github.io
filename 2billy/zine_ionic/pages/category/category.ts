import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { CategoriesData} from '../../providers/categories-data'
import { Shops } from '../shops/shops'; 

/**
 * Generated class for the Category page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
  providers: [ApiService, CategoriesData]
})
export class Category {
  public categories: any[]
  public subCategories: any[]

  constructor(
    private apiServece: ApiService,
    private categoriesData: CategoriesData,
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
    console.log("##########", category)
    this.navCtrl.push(Shops, {cate: category.key})
  }
}
