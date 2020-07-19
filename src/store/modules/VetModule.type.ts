export interface LegacyVetData {
  id: Id;
  updated: Updated;
  category: Category[];
  title: Title;
  content: Content;
  link: Link[];
  gsx$時間戳記: Gsx;
  gsx$醫院名稱: Gsx2;
  gsx$電話號碼: Gsx3;
  gsx$營業日: Gsx4;
  gsx$週一看診時間: Gsx5;
  gsx$週二看診時間: Gsx6;
  gsx$週三看診時間: Gsx7;
  gsx$週四看診時間: Gsx8;
  gsx$週五看診時間: Gsx9;
  gsx$週六看診時間: Gsx10;
  gsx$週日看診時間: Gsx11;
  gsx$地址: Gsx12;
  gsx$座標: Gsx13;
  gsx$地區: Gsx14;
  gsx$是否為24h: Gsx24H;
  gsx$適用寵物類型: Gsx15;
  gsx$服務類別: Gsx16;
  gsx$網站網址: Gsx17;
  gsx$粉絲專頁網址: Gsx18;
  gsx$外觀照片網址: Gsx19;
  gsx$內部照片網址: Gsx20;
}

export interface Id {
  $t: string;
}

export interface Updated {
  $t: string;
}

export interface Category {
  scheme: string;
  term: string;
}

export interface Title {
  type: string;
  $t: string;
}

export interface Content {
  type: string;
  $t: string;
}

export interface Link {
  rel: string;
  type: string;
  href: string;
}

export interface Gsx {
  $t: string;
}

export interface Gsx2 {
  $t: string;
}

export interface Gsx3 {
  $t: string;
}

export interface Gsx4 {
  $t: string;
}

export interface Gsx5 {
  $t: string;
}

export interface Gsx6 {
  $t: string;
}

export interface Gsx7 {
  $t: string;
}

export interface Gsx8 {
  $t: string;
}

export interface Gsx9 {
  $t: string;
}

export interface Gsx10 {
  $t: string;
}

export interface Gsx11 {
  $t: string;
}

export interface Gsx12 {
  $t: string;
}

export interface Gsx13 {
  $t: string;
}

export interface Gsx14 {
  $t: string;
}

export interface Gsx24H {
  $t: string;
}

export interface Gsx15 {
  $t: string;
}

export interface Gsx16 {
  $t: string;
}

export interface Gsx17 {
  $t: string;
}

export interface Gsx18 {
  $t: string;
}

export interface Gsx19 {
  $t: string;
}

export interface Gsx20 {
  $t: string;
}
