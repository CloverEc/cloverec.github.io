import {AfterViewInit, Component, DoCheck, ViewChild,ElementRef} from '@angular/core';
import * as ndarray from 'ndarray'
import * as KerasJS from 'keras-js'
import * as ops  from 'ndarray-ops'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements AfterViewInit, DoCheck {
  title = 'app'
  reslt = ""
   //context: CanvasRenderingContext2D;
  // @ViewChild('myCanvas') myCanvas;
  @ViewChild('myCanvas') canvasElm: ElementRef;
  @ViewChild('video') videoElm: ElementRef;
  private captureData: string;


  readonly medias: MediaStreamConstraints = {audio: false, video: {
      width: { min:  480, ideal: 500, max: 1000 },
      height: { min: 480, ideal: 500, max: 1000 },
  }};

    ngAfterViewInit() {
            // const canvas = this.myCanvas.nativeElement;
            // this.context = canvas.getContext('2d');
            this.startCamera();

            // setTimeout(()=>{
              //  this.draw()
            // },100)
        }
    //
    ngDoCheck() {
        // this.draw();
    }
      onClick() {
          this.captureData = this.draw();
        }
      startCamera() {
          window.navigator.mediaDevices.getUserMedia(this.medias)
              .then(stream => this.videoElm.nativeElement.srcObject = stream)
                  .catch(error => {
                      console.error(error);
                      alert(error);
             });
      }

      draw() {

          const WIDTH = this.videoElm.nativeElement.clientWidth;
          const HEIGHT = this.videoElm.nativeElement.clientHeight;
          // canvasを用意する
          const ctx = this.canvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;
          this.canvasElm.nativeElement.width  = WIDTH;
          this.canvasElm.nativeElement.height = HEIGHT;

          // canvasの描画をしつつBase64データを取る

          const model = new KerasJS.Model({
              filepath: '/assets/models/model1d.bin',
              transferLayerOutputs: true,
              filesystem: true
          })
          if (ctx) {
                  console.log('inin')
                  // this.context.drawImage(img, 0, 0,100,100);
                  this.canvasElm.nativeElement.toDataURL(ctx.drawImage(this.videoElm.nativeElement, 0, 0, WIDTH, HEIGHT));
                  setTimeout(()=>{
                  const imageData  = ctx.getImageData(0,0,25,25);
                  let input =  []
                  let r = []
                  let g = []
                  let b = []
                  for (var i = 0; i < imageData.data.length; i += 4){
                      r.push(imageData.data[i])
                      g.push(imageData.data[i+1])
                      b.push(imageData.data[i+2])
                  }
                  input = r.concat(g);
                  input = input.concat(b);

                  console.log(input)
                      model.ready()
                          .then(() => {
                              const inputData = {
                                  input: new Float32Array(input)
                              }
                              return model.predict(inputData)
                          })
                              .then(outputData => {
                                  console.log('yay!')
                                  console.log(outputData)
                                  if (outputData.output[0] > 0.8){
                                     this.reslt = "オレンジ"
                                  }else if (outputData.output[1] > 0.8){
                                     this.reslt = "りんご"
                                  }else{
                                      this.reslt = 'わからない'
                                  }
                              })
                                  .catch(err => {
                                      console.error(err)
                              })


                  },100)
               // console.log(imageData.data.transpose(2, 0, 1))
              }
              // let data = imageData.data.transpose(2, 0, 1)
              //let input = new Float32Array(data.data) 
         }
      }


}
