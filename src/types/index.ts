export interface Banner {
  id: number;
  image: string;
  url: string;
}

export interface ConfigItem {
  id: number;
  name: string;
  icon: string;
  url: string;
  type: number;
}

export interface Hotline {
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