import { Observable }     from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'
let isLogin: boolean = true
@Injectable()
export class ApiService {
  private api_rooturl : string = "https://api2.shanghai-zine.com";
//  private api_rooturl : string = "http://103.20.248.31:3000";
  // private api_rooturl : string = "http://localhost:9090";
  private wechat_api_url :string = "https://api.weixin.qq.com"
  public ws_root_url:string = ""
  public errTitle: string = "エラーが発生しました"
  static get parameters(){
    return [[Http]];
  }
  constructor(private http:Http){
  }

  setLogin(val: boolean) {
    isLogin = val
  }

  isLogin() {
    return isLogin
  }

  save(url:string, token:string,params?: any,uuid?:string): Observable<any>{
    let apiurl = this.api_rooturl + url;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization',  token);
    headers.append('Content-Md5', uuid);
    var response = this.http.post(apiurl
      , params
      , {headers: headers}
    ).timeout(10000).map(res => res.json());
    return response;
  }

  deleteData(url:string, uuid?:string, token?:string): Observable<any>{
    let apiurl = this.api_rooturl + url;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Md5', uuid);
    headers.append('Authorization',  token);
    var response = this.http.delete(apiurl
      , {headers: headers}
    ).timeout(10000).map(res => res.json());
    return response;
  }

  postData(url:string,params?:any, md5?:string, token?:string,version?:string): Observable<any>{
    let apiurl = this.api_rooturl + url;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Md5', md5);
    headers.append('Authorization',  token);
    headers.append('Accept',  version);
    var response = this.http.post(apiurl
      , params
      , {headers: headers}
    ).timeout(10000).map(res => res.json());
    return response;
  }

  putData(url:string, uuid?:any, token?:string, params?:any): Observable<any>{
    console.log(params)
    let apiurl = this.api_rooturl + url;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Md5', uuid);
    headers.append('Authorization',  token);
    let options = new RequestOptions({ headers: headers }); 
    console.log(headers)
    var response = this.http.put(apiurl
      , params
      , options
    ).timeout(10000).map(res => res.json());
    return response;
  }

  getData(url:string, uuid?:any, token?:string): Observable<any>{
    let apiurl = this.api_rooturl + url;
    let headers = new Headers();
    headers.append('Content-Md5', uuid);
    if(token){
      headers.append('Authorization',  token);
    }
    let opt: RequestOptions
      opt = new RequestOptions({
        headers: headers,
    })
    var response = this.http.get(apiurl,opt).timeout(10000).map(res => res.json());
    return response;
  }

  getWeixinData(url:string): Observable<any>{
    let apiurl = this.wechat_api_url + url;
    var response = this.http.get(apiurl).timeout(10000).map(res => res.json());
    return response;
  }

  postWeixinData(url:string,params:string): Observable<any>{
    let apiurl = this.api_rooturl + url;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var response = this.http.post(
        apiurl
      , params
      , {headers: headers}
    ).timeout(10000).map(res => res.json());
    return response;
  }
  
  postPromise(url: string, params?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        this.postData(url, params).subscribe(
          data => {
            console.log(data)
            resolve(data);
          },error => {
            console.log("Oooops!");
            reject(error)
          }
        );
    }).catch((err)=> {
      console.error((err && err.stack) || err);
      throw (err)
    });
  }

  putPromise(url: string, uuid:string, token: string, params?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        this.putData(url, uuid, token, params).subscribe(
          data => {
            console.log(data)
            resolve(data);
          },error => {
            console.log("Oooops!");
            reject(error)
          }
        );
    }).catch((err)=> {
      console.error((err && err.stack) || err);
      throw (err)
    });
  }
  
  isLoginPromise(url:string,token:string){
    return new Promise<any>((resolve, reject) => {
        this.getData(url,token).subscribe(
          data => {
            console.log(data)
            resolve(data);
          },error => {
            console.log("Oooops!");
            reject(error)
          }
        );
    }).catch((err)=> {
      console.error((err && err.stack) || err);
      throw (err)
    });
  }
  postLogin(url:string,params:any){
    console.log(params)
    let apiurl = this.api_rooturl + url;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers }); 
    this.http.post(apiurl , params , options).subscribe((r) => { console.log(r) })
  }
}
