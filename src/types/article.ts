export interface Article {
  id: number;
  cat_id: number;
  cat_name: string;
  is_show_image: number;
  author_id: number;
  category_id: number;
  title: string;
  excerpt: string;
  image: string;
  url_title: string;
  published_at: Date;
}

export interface PageInfor {
  pagenumber: number;
  pagesize: number,
  category_id: number;
}