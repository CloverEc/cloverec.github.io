import { Injectable } from '@angular/core';

@Injectable()
export class TagsData {
  constructor(){
  }

  sourcesData(): any[] {
    let data = [
      {key: 8,  val: "深夜営業"},
      {key: 9,  val: "接待向き"},
      {key: 14, val: "個室"},
      {key: 15, val: "アテンド"},
      {key: 16, val: "パーティ&amp;宴会"},
      {key: 17, val: "食べ飲み放題"},
      {key: 18, val: "ファミリー"},
      {key: 19, val: "デート"},
      {key: 20, val: "テラス"},
      {key: 21, val: "おひとりさま"},
      {key: 22, val: "ラーメン"},
      {key: 23, val: "ブランチ"},
      {key: 24, val: "ホテルレストラン"},
      {key: 25, val: "ガールズバー"},
      {key: 26, val: "焼酎＆日本酒"},
      {key: 27, val: "ワインバー"},
      {key: 28, val: "ビアレストラン"},
      {key: 29, val: "ホテルバー"},
      {key: 30, val: "夜景"},
      {key: 31, val: "ハッピーアワー"},
      {key: 32, val: "友達同僚と"},
      {key: 33, val: "魚の美味しい店"},
      {key: 34, val: "ショットバー"},
      {key: 35, val: "カフェバー"},
      {key: 36, val: "カフェバー"}
    ]
    return data
  }
}

