import {Pipe} from '@angular/core';
 
@Pipe({
  name: 'myPipe'
})
export class MyPipe {
  transform(value, i) {
    
    let newValue = "";
    let title = ""
    switch (i) {
      case 0:
        title  = "料理";
        break;
      case 1:
        title = "ドリンク";
        break;
      case 2:
        title = "サービス";
        break;
      case 3:
        title = "清潔度";
        break;
      case 4:
        title = "雰囲気";
        break;
      case 5:
        title = "コスパ";
        break;
      default:
        title = "そのた";
    }
 
    newValue = title + value + "|";
 
    return newValue;
  }
}
