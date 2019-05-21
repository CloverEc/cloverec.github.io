import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, LoadingController } from 'ionic-angular';
import { ApiService} from '../../providers/api-service'
import { Content } from 'ionic-angular'; 
import { PhotoViewer } from '@ionic-native/photo-viewer'; 
import { PhotoSlidesPage } from '../photo-slides/photo-slides'; 
/**
 * Generated class for the PhotoViewerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-photo-viewer',
  providers: [ApiService],
  templateUrl: 'photo-viewer.html',
})
export class PhotoViewerPage {
  public evaluate_pictures:any
  viewer: string = "all";
  page: number
  category:any
  grid:any
  all_pictures:any
  type_id: number
  rowNum:number
  type:string
  @ViewChild(Content) content: Content;
  constructor(
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    public apiServece: ApiService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams
  ) {
    this.category = ""
    this.page = 1
    this.grid = []
    this.evaluate_pictures = []
    this.all_pictures = []
    let loader = this.loadingCtrl.create()

    loader.present()
    setTimeout(()=>{
      let data = []
      if (this.navParams.get("type") == "user"){
        this.type_id  = this.navParams.get("uid")
        this.type = "users"
      }else{
        this.type = "shop"
        this.type_id  = this.navParams.get("shop_id")
      }
        this.apiServece.getData(
          "/api/evaluate_pictures?type=" + this.type +  "&target_id=" + this.type_id + "&limit=15&page=" + this.page
        ).subscribe(resp => {
          console.log(resp)
          this.evaluate_pictures = resp.data
            resp.data.forEach((v)=>{
              this.all_pictures.push(v)
            })
          this.rowNum = 0; //counter to iterate over the rows in the grid
          for (let i = 0; i < this.evaluate_pictures.length; i+=2) { //iterate images
            this.grid[this.rowNum] = Array(2); //declare two elements per row
          if (this.evaluate_pictures[i]) { 
            this.grid[this.rowNum][0] = this.evaluate_pictures[i] //insert image
          }
          if (this.evaluate_pictures[i+1]) { //repeat for the second image
            this.grid[this.rowNum][1] = this.evaluate_pictures[i+1]
              this.rowNum++; //go on to the next row
          }
          }
          loader.dismiss()
        }, err=>{
          loader.dismiss()
          console.error(err)
        })
    },100)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoViewerPage');
  }



  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    this.page++ 
    setTimeout(() => {
      setTimeout(()=>{
          this.apiServece.getData("/api/evaluate_pictures?type=" + this.type + "&target_id=" + this.type_id + "&limit=15&page=" + this.page + "&" +  this.category).subscribe(resp => {
            this.evaluate_pictures = resp.data
            console.log(resp.data[0])
            console.log("++++++++++++++++++++++++++")
            let data = []
            if (!this.evaluate_pictures){
              return
            }
            resp.data.forEach((v)=>{
              this.all_pictures.push(v)
            })
            if (!this.grid[this.grid.length-1][1]){
              this.grid[this.grid.length-1][1] = this.evaluate_pictures[0]
              this.evaluate_pictures.shift()
            }
            this.evaluate_pictures.forEach((v,i)=>{
                if (i % 2 == 0) {
                  data.push(v)
                } else {
                  data.push(v)
                  this.grid.push(data)
                  data = []
                }
            })
          }, err=>{
              console.error(err)
         })
      },100)
        console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

 onCategory(i){
   switch (i) {
     case 1:
       this.category = "category=1";
       break;
     case 2:
       this.category = "category=2";
       break;
     case 3:
       this.category = "category=3";
       break;
     case 4:
       this.category = "category=4";
       break;
     default:
       this.category = "";
   }
    let loader = this.loadingCtrl.create()
    loader.present()
    setTimeout(()=>{
      this.page = 1
      this.evaluate_pictures = []
      this.all_pictures = []
      this.grid = []
      let data = []
        console.log(this.category)
        this.apiServece.getData("/api/evaluate_pictures?type=" + this.type + "&target_id=" + this.type_id + "&limit=15&page=" + this.page + "&" + this.category ).subscribe(resp => {
          console.log(resp.data)
          this.evaluate_pictures = resp.data
            resp.data.forEach((v)=>{
              this.all_pictures.push(v)
            })
          this.rowNum = 0; //counter to iterate over the rows in the grid
          for (let i = 0; i < this.evaluate_pictures.length; i+=2) { //iterate images
            this.grid[this.rowNum] = Array(2); //declare two elements per row
          if (this.evaluate_pictures[i]) { 
            this.grid[this.rowNum][0] = this.evaluate_pictures[i] //insert image
          }
          if (this.evaluate_pictures[i+1]) { //repeat for the second image
            this.grid[this.rowNum][1] = this.evaluate_pictures[i+1]
              this.rowNum++; //go on to the next row
          }
          }
          loader.dismiss()
        }, err=>{
          loader.dismiss()
          console.error(err)
        })
    },100)
 
 }

  onPhotoViewer(img,title,row){
      let index:number
      console.log("++++++++++++++++")
      console.log(this.all_pictures)
      console.log(this.all_pictures.length)
      console.log("++++++++++++++++")
      this.all_pictures.forEach((v,i)=>{
        if (v.image === img){
          index = i
        }
      })
      this.navCtrl.push(PhotoSlidesPage,{images: this.all_pictures,index: index})
//    this.photoViewer.show(img, title, {share: false}); 
  }
}
