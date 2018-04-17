import {AfterViewInit, Component, ViewChild,ElementRef} from '@angular/core';
import * as ndarray from 'ndarray'
import * as KerasJS from 'keras-js'
import * as ops  from 'ndarray-ops'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements AfterViewInit{
  title = 'app'
  reslt = ""
  @ViewChild('myCanvas') canvasElm: ElementRef;
  @ViewChild('video') videoElm: ElementRef;
  private captureData: any;
  private  model:any 
  readonly medias: MediaStreamConstraints = {audio: false, video: {
      width: { min:  100, ideal: 100, max: 100 },
      height: { min: 100, ideal: 100, max: 100 },
  }};

    ngAfterViewInit() {
     this.startCamera();
     this.model = new KerasJS.Model({
         filepath: '/assets/models/model1d2.bin',
         transferLayerOutputs: true,
         filesystem: true
     })
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
        this.canvasElm
        this.reslt = ""
        const WIDTH = 100
        const HEIGHT = 100;
        const ctx = this.canvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect( 0, 0, WIDTH, HEIGHT);
        this.canvasElm.nativeElement.width  = WIDTH;
        this.canvasElm.nativeElement.height = HEIGHT;

        if (ctx) {
            ctx.drawImage(this.videoElm.nativeElement, 0, 0, 100, 100))
            setTimeout(()=>{
                const imageData = ctx.getImageData(0,0,100,100);
                let input =  []
                let r = []
                let g = []
                let b = []
                for (var i = 0; i < imageData.data.length; i += 4){
                    r.push(imageData.data[i]/255)
                    g.push(imageData.data[i+1]/255)
                    b.push(imageData.data[i+2]/255)
                }
                input = r.concat(g);
                input = input.concat(b);
                this.model.ready()
                .then(() => {
                    const inputData = {
                        input: new Float32Array(input)
                    }
                    return this.model.predict(inputData)
                }).then(outputData => {
                    console.log(outputData)
                    if (outputData.output[0] === 1){
                        this.reslt = "オレンジ"
                    }else if(outputData.output[1] === 1 ){
                        this.reslt = "りんご"
                    }else{
                        this.reslt = "わからない"
                    }
                }).catch(err => {
                    console.error(err)
                })
            },100)
        }
    }
}
