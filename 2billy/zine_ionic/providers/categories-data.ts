import { Injectable } from '@angular/core';

@Injectable()
export class CategoriesData {
  constructor(){
  }

  firstCategories(): any[] {
    let categories:any = []
    this.sourcesData().forEach((category) => {
      categories.push({name: category.val, id: category.key})
    })
    return categories
  }

  firstCategoriesForPicker(): any[] {
    let categories:any = []
    this.sourcesData().forEach((category) => {
      categories.push({text: category.val, value: category.key})
    })
    return categories
  }

  secondCategoriesForPicker(): any[] {
    let categories:any = []
    this.sourcesData().forEach((l1) => {
      if (l1.sub) {
        l1.sub.forEach((l2) => {
          categories.push({text: l2.val, value: l2.key, parentVal: l1.key})
        })
      } else {
        categories.push({text: "", value: 0, parentVal: l1.key})
      }
    })
    return categories
  }

  thirdCategoriesForPicker(): any[] {
    let categories:any = []
    this.sourcesData().forEach((l1) => {
      if (l1.sub) {
        l1.sub.forEach((l2) => {
          if (l2.sub) {
            l2.sub.forEach((l3) => {
              categories.push({text: l3.val, value: l3.key, parentVal: l2.key})
            })
          } else {
            categories.push({text: "", value: 0, parentVal: l2.key})
          }
        })
      }
    })
    return categories
  }

  subCategoriesById(id): any[] {
    let subCategories:any = []
    this.sourcesData().some((category) => {
      if (id == category.key) {
        subCategories = category.sub
        return true
      }
    })
    return subCategories
  }

  sourcesData(): any[] {
    let data = [
      { key: 1, val: "グルメ", sub:
        [
          {key: 10, val: "日本料理", sub: [
            {key: 11, val: "焼肉"},
            {key: 12, val: "寿司"},
            {key: 13, val: "居酒屋"},
            {key: 14, val: "うどん"},
            {key: 15, val: "そば"},
            {key: 16, val: "うなぎ"},
				    {key: 17, val: "お好み焼き"},
				    {key: 18, val: "もんじゃ焼き"},
				    {key: 19, val: "鍋・しゃぶしゃぶ"},
				    {key: 20, val: "たこ焼き"},
				    {key: 21, val: "とんかつ・串かつ"},
				    {key: 22, val: "カレー"},
				    {key: 23, val: "天ぷら"},
				    {key: 24, val: "焼き鳥"},
				    {key: 25, val: "炉端焼き"},
				    {key: 26, val: "鉄板焼き"},
				    {key: 27, val: "九州料理"},
				    {key: 28, val: "沖縄料理"},
				    {key: 29, val: "食べ飲み放題有"},
				    {key: 30, val: "深夜営業"},
				    {key: 148, val: "和食"},
          ]},
          {key: 31, val: "各国料理", sub: [
            {key: 32, val: "ベトナム料理"},
            {key: 33, val: "イタリア料理"},
            {key: 34, val: "フランス料理"},
            {key: 35, val: "スペイン料理"},
            {key: 36, val: "インド料理"},
            {key: 37, val: "タイ料理"},
            {key: 38, val: "韓国料理"},
            {key: 39, val: "中華料理"},
            {key: 40, val: "北朝鮮料理"},
            {key: 41, val: "グリル料理"},
            {key: 42, val: "ロシア料理"},
            {key: 43, val: "アフリカ料理"},
            {key: 44, val: "マレーシア料理"},
            {key: 45, val: "ベルギー料理"},
            {key: 46, val: "中近東料理"},
            {key: 47, val: "地中海料理"},
            {key: 48, val: "ドイツ料理"},
            {key: 49, val: "オーストラリア料理"},
            {key: 50, val: "カナダ料理"},
            {key: 51, val: "ブルガリア料理"},
            {key: 52, val: "ブラジル料理"},
            {key: 53, val: "アメリカ料理"},
            {key: 54, val: "ギリシア料理"},
            {key: 55, val: "シンガポール料理"},
            {key: 56, val: "メキシコ料理"},
            {key: 57, val: "アイルランド料理"},
            {key: 58, val: "モロッコ料理"},
            {key: 59, val: "インドネシア料理"},
            {key: 60, val: "オーストリア料理"},
            {key: 61, val: "コンチネンタル料理"},
            {key: 62, val: "ホテルビュッフェ"},
            {key: 63, val: "ネパール料理"},
            {key: 64, val: "スイス料理"},
            {key: 65, val: "レストランBAR"},
            {key: 138, val: "レストラン&amp;BAR"},
            {key: 145, val: "カフェ"},
            {key: 146, val: "創作料理"},
            {key: 205, val: "中南米料理"},
            {key: 275, val: "ベトナム料理"},
          ]}, 
          {key: 66, val: "創作料理", sub: [
            {key: 67, val: "創作料理"},
            {key: 140, val: "コンチネンタル料理"},
            {key: 141, val: "レストラン&amp;BAR"},
            {key: 142, val: "ギリシア料理"},
            {key: 143, val: "地中海料理"},
            {key: 144, val: "モロッコ料理"},
          ]},
          {key: 70, val: "カフェ", sub: [
            {key: 71, val: "カフェ"},
            {key: 139, val: "レストラン&amp;BAR"},
          ]},
          {key: 72, val: "ファミリーレストラン", sub: [
            {key: 73, val: "ファミリーレストラン"},
            {key: 260, val: "フードコート"},
          ]},
          {key: 74, val: "デリバリー", sub: [
            {key: 75, val: "デリバリー"},
          ]},
          {key: 76, val: "ラーメン", sub: [
            {key: 77, val: "ラーメン"},
          ]},
          {key: 203, val: "スイーツ", sub: [
            {key: 204, val: "スイーツ"},
            {key: 276, val: "スイーツ"},
            {key: 277, val: "スイーツ"},
          ]},
          {key: 239, val: "火鍋", sub: [
            {key: 240, val: "火鍋"},
          ]},
          {key: 241, val: "ファーストフード", sub: [
            {key: 242, val: "ハンバーガー"},
            {key: 243, val: "中華"},
            {key: 248, val: "牛丼"},
          ]}
        ]
      }, {key: 2, val: "ナイトライフ", sub:
        [
          {key: 78, val: "CLUB", sub: [
            {key: 79, val: "CLUB"},
          ]},
          {key: 80, val: "Bar", sub: [
            {key: 81, val: "Bar"},
            {key: 82, val: "レストランBAR"},
            {key: 137, val: "レストラン&amp;BAR"},
          ]},
          {key: 234, val: "ガールズバー", sub: [
            {key: 235, val: "ガールズバー"},
          ]},
          {key: 258, val: "カラオケボックス", sub: [
            {key: 259, val: "カラオケボックス"},
          ]}
        ]
      }, {key: 3, val: "学ぶ", sub:
        [ 
          {key: 83, val: "語学", sub: [
            {key: 84, val: "英語"},
            {key: 85, val: "中国語"},
            {key: 86, val: "韓国語"},
            {key: 87, val: "その他外国語"},
          ]},
          {key: 88, val: "就学", sub: [
            {key: 89, val: "幼稚園"},
            {key: 90, val: "小学校"},
            {key: 91, val: "中学校"},
            {key: 92, val: "高校"},
            {key: 93, val: "大学"},
          ]},
          {key: 94, val: "カルチャー", sub: [
            {key: 98, val: "習いごと"},
            {key: 96, val: "資格"},
            {key: 161, val: "中国文化"},
            {key: 162, val: "音楽"},
            {key: 163, val: "ヨガ"}
          ]},
          {key: 97, val: "スポーツ", sub: [
            {key: 98, val: "スポーツ"}
          ]},
          {key: 164, val: "学習塾", sub: [
            {key: 165, val: "学習塾"}
          ]},
          {key: 166, val: "資格", sub: [
            {key: 167, val: "資格"}
          ]},
          {key: 222, val: "教育支援", sub: [
            {key: 223, val: "教育支援"}
          ]}
        ]
      }, {key: 4, val: "観光・ホテル", sub:
        [
          {key: 99, val: "ホテル", sub: [
            {key: 100, val: "ホテル"},
            {key: 255, val: "3つ星以下"},
            {key: 256, val: "4つ星"},
            {key: 257, val: "5つ星"}
          ]},
          {key: 101, val: "旅行・航空券", sub: [
            {key: 238, val: "旅行・航空券"}
          ]},
          {key: 103, val: "観光地", sub: [
            {key: 104, val: "観光地"}
          ]},
          {key: 105, val: "アクティビティ", sub: [
            {key: 106, val: "カラオケ"},
            {key: 107, val: "アウトドア"},
            {key: 108, val: "スポーツ"},
            {key: 109, val: "映画館"},
            {key: 110, val: "体験"},
            {key: 216, val: "スーパー銭湯"},
          ]},
          {key: 160, val: "舞台・コンサート", sub: [
            {key: 187, val: "舞台・コンサート"},
          ]},
          {key: 181, val: "遊び・ゴルフ", sub: [
            {key: 182, val: "カラオケ"},
            {key: 230, val: "麻雀"},
            {key: 236, val: "ゴルフ"},
            {key: 254, val: "ボウリング"}
          ]},
          {key: 211, val: "レンタカー", sub: [
            {key: 215, val: "レンタカー・ハイヤー"}
          ]},
          {key: 273, val: "アートギャラリー", sub: [
            {key: 274, val: "アートギャラリー"}
          ]}
        ]
      }, { key: 5, val: "美容・マッサージ", sub:
        [
          {key: 111, val: "美容院", sub: [
            {key: 112, val: "美容院"}
          ]},
          {key: 113, val: "エステ", sub: [
            {key: 114, val: "エステ"}
          ]},
          {key: 115, val: "ネイル", sub: [
            {key: 116, val: "ネイル"}
          ]},
          {key: 117, val: "マッサージ", sub: [
            {key: 118, val: "マッサージ"}
          ]},
          {key: 224, val: "SPA", sub: [
            {key: 225, val: "SPA"}
          ]},
          {key: 226, val: "化粧品", sub: [
            {key: 227, val: "化粧品"}
          ]},
          {key: 269, val: "Kids"},
          {key: 271, val: "Kids hair salon"},
        ]
      }, {key: 6, val: "医療", sub: 
        [
          {key: 119, val: "総合", sub: [
            {key: 120, val: "総合"}
          ]},
          {key: 121, val: "クリニック", sub: [
            {key: 122, val: "クリニック"}
          ]},
          {key: 123, val: "歯科", sub: [
            {key: 124, val: "歯科"}
          ]},
          {key: 125, val: "小児科", sub: [
            {key: 126, val: "小児科"}
          ]},
          {key: 127, val: "ペインクリニック", sub: [
            {key: 128, val: "ペインクリニック"}
          ]},
          {key: 129, val: "整体", sub: [
            {key: 130, val: "整体"}
          ]},
          {key: 131, val: "中医", sub: [
            {key: 132, val: "中医"}
          ]},
          {key: 133, val: "美容外科", sub: [
            {key: 134, val: "美容外科"}
          ]},
          {key: 135, val: "医療サービス", sub: [
            {key: 136, val: "医療サービス"}
          ]},
          {key: 149, val: "健康食品", sub: [
            {key: 250, val: "健康食品"}
          ]},
          {key: 252, val: "動物病院", sub: [
            {key: 253, val: "動物病院"}
          ]},
        ]
      }, { key: 7, val: "不動産・生活", sub: 
        [
          {key: 151, val: "スーパー", sub: [
            {key: 155, val: "スーパー"}
          ]},
          {key: 152, val: "食品", sub: [
            {key: 156, val: "食品"}
          ]},
          {key: 153, val: "ショップ", sub: [
            {key: 157, val: "ショップ"},
            {key: 210, val: "メガネ"},
            {key: 213, val: "フラワーショップ"},
            {key: 228, val: "ペットショップ"},
            {key: 231, val: "ワインショップ"}
          ]},
          {key: 154, val: "宅配", sub: [
            {key: 158, val: "宅配"}
          ]},
          {key: 189, val: "ペット", sub: [
            {key: 191, val: "ペットショップ"}
          ]},
          {key: 194, val: "水", sub: [
            {key: 195, val: "浄水器"},
            {key: 196, val: "飲料水"}
          ]},
          {key: 197, val: "航空券手配", sub: [
            {key: 198, val: "航空券手配"}
          ]},
          {key: 199, val: "携帯・通信", sub: [
            {key: 200, val: "携帯・通信"}
          ]},
          {key: 201, val: "不動産", sub: [
            {key: 202, val: "不動産"},
            {key: 229, val: "サービスアパートメント"}
          ]},
          {key: 208, val: "ファッション", sub: [
            {key: 209, val: "ファッション"}
          ]},
          {key: 214, val: "クリーニング", sub: [
            {key: 215, val: "クリーニング"}
          ]},
          {key: 217, val: "テレビ", sub: [
            {key: 218, val: "テレビ"}
          ]},
          {key: 220, val: "百貨店・モール", sub: [
            {key: 221, val: "百貨店・ショッピングモール"}
          ]},
          {key: 232, val: "公的機関", sub: [
            {key: 233, val: "公的機関"}
          ]},
          {key: 244, val: "フォトスタジオ", sub: [
            {key: 245, val: "フォトスタジオ"}
          ]},
          {key: 246, val: "フィットネス", sub: [
            {key: 247, val: "フィットネスクラブ"}
          ]},
          {key: 261, val: "保険", sub: [
            {key: 265, val: "保険"}
          ]},
          {key: 272, val: "運輸・引越"},
        ]
      }, {key: 8, val: "ビジネス", sub: 
        [
          {key: 168, val: "運輸・引越", sub: [
            {key: 174, val: "運輸・引越"}
          ]},
          {key: 169, val: "翻訳・通訳", sub: [
            {key: 175, val: "翻訳・通訳"}
          ]},
          {key: 170, val: "日系公共機関", sub: [
            {key: 176, val: "日系公共機関"}
          ]},
          {key: 171, val: "オフィス", sub: [
            {key: 177, val: "オフィス"}
          ]},
          {key: 172, val: "IT", sub: [
            {key: 178, val: "IT"}
          ]},
          {key: 173, val: "倉庫", sub: [
            {key: 179, val: "倉庫"}
          ]},
          {key: 184, val: "法律", sub: [
            {key: 237,val: "法律"}
          ]},
          {key: 192, val: "コンサルティング", sub: [
            {key: 193, val: "コンサルティング"}
          ]},
          {key: 206, val: "印刷", sub: [
            {key: 207, val: "印刷"}
          ]},
          {key: 263, val: "ビジネス保険"},
        ]
      }, {key: 9, val: "仕事探し", sub: 
        [
         {key: 149, val: "仕事探し"}
        ]
      }
    ]
    return data
  }
}
