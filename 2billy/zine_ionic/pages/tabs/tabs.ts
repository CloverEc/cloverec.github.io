import { Component,ViewChild} from '@angular/core';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { Shops } from '../shops/shops';
import { User } from '../user/user'
import { ContactPage } from '../contact/contact';
import { Campaigns } from '../campaigns/campaigns'
import { Evaluates } from '../evaluates/evaluates';
import { Storage } from '@ionic/storage'; 
import { NavController,MenuController, NavParams,Events } from 'ionic-angular';
import { App } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = Campaigns;
  tab3Root: any = Evaluates;
  // tab4Root: any = HomePage;
  @ViewChild('mainTabs') mainTabs: TabsPage;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public navParams: NavParams,
    public events: Events,
    public app: App,
    public storage: Storage
  ) {
  }

  tapped(){
    setTimeout(()=> {
      this.events.publish('home:scrollToTop', Date.now() );
    } ,0)
  }

 openMenu(){
   this.menuCtrl.open();
 }
 ionSelected() {
   console.log("Home Page has been selected");
   // do your stuff here
  }
}
