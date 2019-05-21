import { Component } from '@angular/core';
import {ApiService} from '../../providers/api-service'
import { NavController } from 'ionic-angular';
import { Shop } from '../shop/shop'; 

@Component({
  selector: 'page-contact',
  providers: [ApiService],
  templateUrl: 'contact.html'
})
export class ContactPage {
  public shops: any[]

  constructor(
    public navCtrl: NavController,
    private apiServece: ApiService,
  ) {
    this.apiServece.getData("/api/shops?limit=15&page=1&cate_id=10&lat=31.067333&lng=121.313108").subscribe(resp => {
      this.shops = resp.data
      console.log(resp)
    }, err=>{
      console.error(err)
    })
  }

  openShop(shopId) {
    this.navCtrl.push(Shop, {id: shopId})
  }
}
