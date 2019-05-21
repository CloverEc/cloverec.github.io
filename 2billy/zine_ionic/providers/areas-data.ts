
import { Injectable } from '@angular/core';

@Injectable()
export class AreasData {
  constructor(){
  }

  firstAreas(): any[] {
    let areas:any = []
    this.sourcesData().forEach((area) => {
      if (area.key != 52 || area.key != 54) {
        areas.push({name: area.val, id: area.key})
      }
    })
    return areas
  }

  firstAreasForPicker(): any[] {
    let areas:any = []
    this.sourcesData().forEach((area, ind) => {
      if (ind != 0) {
        areas.push({text: area.val, value: area.key})
      }
    })
    return areas
  }

  subAreasById(id): any[] {
    let subAreas:any = []
    this.sourcesData().some((area) => {
      if (id == area.key) {
        subAreas = area.sub
        return true
      }
    })
    return subAreas
  }

  secondAreas(): any[] {
    let areas:any = []
    this.sourcesData().forEach((area, ind) => {
      if (ind != 0) {
        area.sub.forEach(sub => {
          areas.push({text: sub.val, value: sub.key, parentVal: area.key})
        })
      }
    })
    return areas
  }

  thirdAreas(): any[] {
    let num = 1000
    let areas:any = []
    this.sourcesData().forEach((area, ind) => {
      if (ind !=0) {
        area.sub.forEach(sub => {
          if (sub.sub) {
            sub.sub.forEach(tArea => {
              areas.push({text: tArea.val, value: tArea.key, parentVal: sub.key})
            })
          } else {
            num = num + 1
            areas.push({text: "", value: num, parentVal: sub.key})
          }
        })
      }
    })
    console.log(areas)
    return areas
  }

  sourcesData(): any[] {
    let data = [
      {
        key: 0, val: "附近", sub: [
          {key: 500, val: "500m"},
          {key: 1000, val: "1000m"},
          {key: 2000, val: "2000m"}
        ]
      }, {
        key: 1, val: "上海", sub: [
          {key: 52, val: "江蘇・蘇州", sub: [
            {key: 53, val: "蘇州"},
            {key: 55, val: "南通"},
            {key: 56, val: "張家港"},
            {key: 57, val: "平湖"},
            {key: 59, val: "太倉"},
            {key: 60, val: "昆山"}
          ]},
          {key: 54, val: "浙江省", sub: [
            {key: 58, val: "海宁"}
          ]},
          {key: 2, val: "外灘"},
          {key: 3, val: "静安"},
          {key: 4, val: "新天地"},
          {key: 5, val: "徐家匯"},
          {key: 6, val: "古北"},
          {key: 7, val: "浦東"},
          {key: 8, val: "上海北"}
        ]
      }, {
        key: 2, val: "外灘", sub: [
          {key: 9, val: "外灘"},
          {key: 10, val: "人民広場"},
          {key: 11, val: "豫園"},
        ]
      }, {
        key: 3, val: "静安", sub: [
          {key: 12, val: "静安寺"},
          {key: 13, val: "中山公園"},
          {key: 14, val: "長寿路"},
          {key: 44, val: "南京西路"},
          {key: 46, val: "長楽路"}
        ]
      }, {
        key: 4, val: "新天地", sub: [
          {key: 20, val: "新天地"},
          {key: 21, val: "田子坊（打浦橋)"},
          {key: 22, val: "淮海中路"}
        ]
      }, {
        key: 5, val: "徐家匯", sub: [
          {key: 15, val: "徐家匯"},
          {key: 16, val: "上海体育館"},
          {key: 17, val: "衡山路"},
          {key: 18, val: "莘庄"},
          {key: 19, val: "淮海路北側"}
        ]
      }, {
        key: 6, val: "古北", sub: [
          {key: 23, val: "古北"},
          {key: 24, val: "虹梅路"},
          {key: 25, val: "龍柏"},
          {key: 26, val: "七宝"},
          {key: 27, val: "北新涇"},
          {key: 28, val: "松江"},
          {key: 45, val: "青浦"},
          {key: 49, val: "呉中路"}
        ]
      }, {
        key: 7, val: "浦東", sub: [
          {key: 38, val: "金橋"},
          {key: 39, val: "外高橋"},
          {key: 40, val: "陸家嘴"},
          {key: 41, val: "世紀公園"},
          {key: 42, val: "南匯"},
          {key: 43, val: "浦東南"},
          {key: 47, val: "塘橋"},
          {key: 48, val: "浦東空港"},
        ]
      }, {
        key: 8, val: "上海北", sub: [
          {key: 29, val: "延長路"},
          {key: 30, val: "五角場"},
          {key: 31, val: "虹口足球場"},
          {key: 32, val: "長風公園"},
          {key: 33, val: "嘉定"},
          {key: 34, val: "宝山"},
          {key: 35, val: "上海駅"},
          {key: 36, val: "控江"},
          {key: 37, val: "四川北路"}
        ]
      }
    ]
    return data
  }
}
