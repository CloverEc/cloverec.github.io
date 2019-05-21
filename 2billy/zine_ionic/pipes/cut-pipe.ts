import {Pipe} from '@angular/core';
 
@Pipe({
  name: 'cutPipe'
})
export class CutPipe {
  transform(str, i) {
    if (str.length > i){
      return str.substring(0,i) + "..."
    }else{
      return str.substring(0,i) 
    }
  }
}
