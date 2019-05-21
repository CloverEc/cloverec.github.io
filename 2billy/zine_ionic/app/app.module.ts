import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TutorialPage } from '../pages/tutorial/tutorial'; 
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar'; 
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserModule } from '@angular/platform-browser'; 
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage'; 
import { PopoverPage } from '../pages/home/home'; 
import { EditorPopoverPage } from '../pages/editorial-department/editorial-department'; 
import { Range } from '../pages/range/range'; 
import { Sort } from '../pages/shops/shops'; 
import { PopoverAreas } from '../pages/campaigns/campaigns'; 
import { PopoverCategories } from '../pages/campaigns/campaigns'; 
import { PopoverTypes } from '../pages/campaigns/campaigns'; 
import { Login } from '../pages/login/login'; 
import { User } from '../pages/user/user'; 
import { ConsultPage } from '../pages/classified-consult/classified-consult'; 
import { Sms } from '../pages/sms/sms'; 
import { BindMobile } from '../pages/bind-mobile/bind-mobile'; 
import { BindEmail } from '../pages/bind-email/bind-email'; 
import { Evaluate } from '../pages/evaluate/evaluate'; 
import { UserDetail } from '../pages/user-detail/user-detail'; 
import { Setting } from '../pages/setting/setting'; 
import { SignUp } from '../pages/sign-up/sign-up'; 
import { Inquiries } from '../pages/inquiries/inquiries'; 
import { Infomation } from '../pages/infomation/infomation'; 
import { BigAddress } from '../pages/shop/shop'; 
import { Search } from '../pages/search/search'; 
import { InAppBrowser } from '@ionic-native/in-app-browser'; 
import { Category } from '../pages/category/category'; 
import { ShopsCategory } from '../pages/shops-category/shops-category'; 
import { Campaign } from '../pages/campaign/campaign'
import { Campaigns }  from '../pages/campaigns/campaigns'
import { AddShop } from '../pages/add-shop/add-shop'
import { Shop } from '../pages/shop/shop'
import { Shops } from '../pages/shops/shops'
import { Evaluates } from '../pages/evaluates/evaluates'
import { EvaluatesSearch } from '../pages/evaluates-search/evaluates-search'
import { AddEvaluatePage } from '../pages/add-evaluate/add-evaluate'
import { Map } from '../pages/map/map'
import { LaunchNavigator } from '@ionic-native/launch-navigator'; 
import { SocialSharing } from '@ionic-native/social-sharing'; 
import { Geolocation } from '@ionic-native/geolocation';
import { Topic } from '../pages/topic/topic'
import { Topics } from '../pages/topics/topics'
import { Camera } from '@ionic-native/camera'; 
import { Crop } from '@ionic-native/crop'; 
import { Transfer } from '@ionic-native/transfer'; 
import { ImagePicker } from '@ionic-native/image-picker'; 
import { Clipboard } from '@ionic-native/clipboard'; 
import { Ionic2RatingModule } from 'ionic2-rating'; 
import {MyPipe} from '../pipes/my-pipe'
import {CutPipe} from '../pipes/cut-pipe'
import { CallNumber } from '@ionic-native/call-number';
import {CorrectionPage} from '../pages/correction/correction';
import {PhotoViewerPage} from '../pages/photo-viewer/photo-viewer'
import {PhotoSlidesPage} from '../pages/photo-slides/photo-slides'
import { PhotoViewer } from '@ionic-native/photo-viewer'; 
import { ClassifiedPage }  from '../pages/classified/classified'
import { ClassifiedsPage }  from '../pages/classifieds/classifieds'
import { ClassifiedAdd }  from '../pages/classified-add/classified-add'
import { UsersPage } from '../pages/users/users'
import { EditorialDepartment }  from '../pages/editorial-department/editorial-department'
import { MultiPickerModule } from 'ion-multi-picker';
import { Push, PushObject, PushOptions } from '@ionic-native/push'; 
import { LocationStrategy, PathLocationStrategy } from '@angular/common'
import {APP_BASE_HREF} from '@angular/common';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@NgModule({
  declarations: [
    AddShop,
    AddEvaluatePage,
    BigAddress,
    Campaign,
    CorrectionPage,
    Campaigns, 
    ClassifiedPage,
    ClassifiedAdd,
    ClassifiedsPage,
    Evaluates,
    EvaluatesSearch,
    Evaluate,
    Shop,
    Shops, 
    ContactPage,
    Category,
    CutPipe,
    ShopsCategory,
    PopoverPage,
    EditorPopoverPage,
    PhotoSlidesPage,
    HomePage,
    Inquiries,
    Infomation,
    Login,
    Map,
    MyApp,
    MyPipe,
    Range,
    Setting,
    SignUp,
    Search,
    Sort,
    PhotoViewerPage,
    PopoverAreas,
    PopoverCategories,
    PopoverTypes,
    TutorialPage,
    TabsPage,
    Topic,
    Topics,
    User,
    ConsultPage,
    Sms,
    BindMobile,
    BindEmail,
    UserDetail,
    UsersPage,
    EditorialDepartment
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MultiPickerModule,
    Ionic2RatingModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '　',
      iconMode: 'ios',
      locationStrategy: 'path',
      // locationStrategy: '',
      menuType: 'push',
      pageTransition: 'ios-transition',
      tabsHideOnSubPages: true
    },
    
    {
      links: [
        { component: User, name: 'User', segment: 'user/:id' },
        { component: Login, name: 'Login', segment: 'login' },
        { component: Shop, name: 'shop', segment: 'shop/:id' },
        { component: Topic, name: 'topic', segment: 'topic/:id' },
        { component: ClassifiedPage, name: 'classified', segment: 'classified/:postId' },
        { component: Evaluate, name: 'evaluate', segment: 'evaluate/:id' },
        { component: Campaign, name: 'campaign', segment: 'campaign/:id' }
      ]
    } ),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AddShop,
    AddEvaluatePage,
    BigAddress,
    Campaign,
    Campaigns, 
    Evaluates,
    EvaluatesSearch,
    Evaluate,
    Shop,
    Shops, 
    Category,
    CorrectionPage,
    ContactPage,
    ClassifiedPage,
    ClassifiedAdd,
    ClassifiedsPage,
    TutorialPage,
    HomePage,
    Login,
    Inquiries,
    Infomation,
    Map,
    MyApp,
    PopoverPage,
    EditorPopoverPage,
    Range,
    Sort,
    PopoverAreas,
    PhotoViewerPage,
    PhotoSlidesPage,
    PopoverCategories,
    PopoverTypes,
    ShopsCategory,
    Setting,
    SignUp,
    Search,
    TabsPage,
    Topic,
    Topics,
    User,
    ConsultPage,
    Sms,
    BindMobile,
    BindEmail,
    UserDetail,
    UsersPage,
    EditorialDepartment
  ],
  providers: [
    SplashScreen,
    StatusBar,
    BrowserModule,
    LaunchNavigator,
    InAppBrowser,
    SocialSharing,
    Geolocation,
    GoogleAnalytics,
      // {provide: APP_BASE_HREF, useValue: "http://localhost:8100"},
      //{provide: APP_BASE_HREF, useValue: "http://m.shanghai-zine.com"},
      //{ provide: LocationStrategy, useClass: PathLocationStrategy },
    CallNumber,
    SafariViewController,
    Camera,
    Clipboard,
    Push,
    Crop,
    PhotoViewer,
    Transfer,
    ImagePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
