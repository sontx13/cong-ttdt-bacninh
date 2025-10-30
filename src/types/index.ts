export interface IBanner {
  id: number;
  image: string;
  url: string;
}

export interface IConfig {
  id: number;
  name: string;
  icon: string;
  url: string;
  type: number;
}

export interface IHotline {
  id: number;
  name: string;
  phone_number: string;
  icon?: string;
}

export interface IHelpInfor {
  id: number;
  name: string;
  url: string;
  icon?: string;
}