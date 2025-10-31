export interface Article {
  id: number;
  title: string;
  titleCut: string;
  imageUrl: string;
  summary: string;
  content: string;
  createdDate: string;
  urlDetail: string;
  author: string;
  viewCount: number;
  cateName: string;
  cateId: number;
}

export interface PageInfor {
  pagenumber: number;
  pagesize: number,
  category_id: number;
}