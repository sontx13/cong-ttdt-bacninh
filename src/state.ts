import { atom, selector, selectorFamily } from "recoil";
import { getLocation, getPhoneNumber, getUserInfo } from "zmp-sdk";
import logo from "static/logo.png";
import { Category } from "types/category";
import { Product, Variant } from "types/product";
import { Cart } from "types/cart";
import { Notification } from "types/notification";
import { calculateDistance } from "utils/location";
import { Store } from "types/delivery";
import { calcFinalPrice } from "utils/product";
import { wait } from "utils/async";
import categories from "../mock/categories.json";
import { Article, PageInfor } from "types/article";
import { BASE_API, BASE_URL, getArticles, getBanners, getCategories, getConfigs, getHotlines, getInfors } from "api";
import { IBanner, IConfig, IHotline, IHelpInfor } from "types";


export const helpInforsState = selector<IHelpInfor[]>({
  key: "helpInforsState",
  get: async () => {
    try {
      const response = await fetch(`${BASE_API}/${getInfors}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      return jsonData.data?.result || [];
    } catch (error) {
      console.error("Error fetching Hotlines:", error);
      return [];
    }
  },
});

export const hotlinesState = selector<IHotline[]>({
  key: "hotlinesState",
  get: async () => {
    try {
      const response = await fetch(`${BASE_API}/${getHotlines}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      return jsonData.data?.result || [];
    } catch (error) {
      console.error("Error fetching Hotlines:", error);
      return [];
    }
  },
});

export const configsState = selector<IConfig[]>({
  key: "configsState",
  get: async () => {
    try {
      const response = await fetch(`${BASE_API}/${getConfigs}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      return jsonData.data?.result || [];
    } catch (error) {
      console.error("Error fetching configs:", error);
      return [];
    }
  },
});

export const bannersState = selector<IBanner[]>({
  key: "bannersState",
  get: async () => {
    try {
      const response = await fetch(`${BASE_API}/${getBanners}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      return jsonData.data?.result || [];
    } catch (error) {
      console.error("Error fetching banners:", error);
      return [];
    }
  },
});

export const hotNewsState = selector<Article[]>({
  key: "hotNews",
  get: async ({ get }) => {
    const page = get(pageInfor);
    // const dataPost = {
    //   pagenumber: page.pagenumber,
    //   pagesize: page.pagesize,
    //   category_id: 1,
    // };

    try {

      const response = await fetch(`${BASE_API}/${getArticles}&isnew=true`);
      
      const data = await response.json();

      // đảm bảo kiểu an toàn
      const hotNews = (data?.data.result || []) as Article[];
      //console.log("getArticles==="+JSON.stringify(hotNews));
      return hotNews;
    } catch (error) {
      console.error("Error fetching hotNews:", error);
      return []; // tránh undefined
    }
  },
});

export const postsState = selector<Product[]>({
  key: "posts",
  get: async () => {
    await wait(2000);
    const posts = (await import("../mock/products.json")).default;
    const variants = (await import("../mock/variants.json"))
      .default as Variant[];
    return posts.map(
      (post) =>
        ({
          ...post,
          variants: variants.filter((variant) =>
          post.variantId.includes(variant.id)
          ),
        } as Product)
    );
  },
});

export const recommendPostsState = selector<Product[]>({
  key: "recommendPosts",
  get: ({ get }) => {
    const posts = get(postsState);
    return posts.filter((p) => p.sale);
  },
});

export const pageInfor = atom<PageInfor>({
  key: "pageInfor",
  default: {
    pagenumber: 1,
    pagesize: 300,
    category_id: 1,
  },
});
//tin tuc
export const listCateState = selector({
  key: "listCate",
  get: async () => {
    try {
      const response = await fetch(`${BASE_API}/${getCategories}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      return jsonData.data?.result || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
});


// --- selectedCategoryState không còn default = 1 nữa ---
export const selectedCategoryState = atom<number | null>({
  key: "selectedCategory",
  default: null, // ban đầu chưa có ID
});

// --- selector giúp chọn danh mục hiện tại (lấy từ listCate nếu chưa có) ---
export const activeCategoryState = selector<number>({
  key: "activeCategory",
  get: ({ get }) => {
    const selected = get(selectedCategoryState);
    const categories = get(listCateState);
    // nếu người dùng chưa chọn, lấy ID đầu tiên trong danh sách
    if (selected !== null) return selected;
    return categories.length > 0 ? categories[0].id : 0;
  },
});

// --- selector lấy danh sách bài viết theo category ---
export const categoryNewsState = selector<Article[]>({
  key: "categoryNews",
  get: async ({ get }) => {
    const activeCategory = get(activeCategoryState);

    if (!activeCategory) return [];

    try {
      const response = await fetch(`${BASE_API}/${getArticles}&category.id=${activeCategory}`);
      const data = await response.json();
      const categoryNews = (data?.data?.result || []) as Article[];
      return categoryNews;
    } catch (error) {
      console.error("Error fetching category news:", error);
      return [];
    }
  },
  set: ({ set }, categoryNews) => set(categoryNewsState, categoryNews),
});


export const userState = atom({
  key: "userAtom",
  default: {
    id: "",
    name: "",
    avatar: "",
  },
});

export const userSelector = selector({
  key: "userSelector",
  get: async ({ get }) => {
    const current = get(userState);
    if (current.id) return current;
    const { userInfo } = await getUserInfo({ autoRequestPermission: true });
    return userInfo || current;
  },
});

export const categoriesState = selector<Category[]>({
  key: "categories",
  get: () => categories,
});

export const productsState = selector<Product[]>({
  key: "products",
  get: async () => {
    await wait(2000);
    const products = (await import("../mock/products.json")).default;
    const variants = (await import("../mock/variants.json"))
      .default as Variant[];
    return products.map(
      (product) =>
        ({
          ...product,
          variants: variants.filter((variant) =>
            product.variantId.includes(variant.id)
          ),
        } as Product)
    );
  },
});

export const recommendProductsState = selector<Product[]>({
  key: "recommendProducts",
  get: ({ get }) => {
    const products = get(productsState);
    return products.filter((p) => p.sale);
  },
});

export const selectedCategoryIdState = atom({
  key: "selectedCategoryId",
  default: "coffee",
});

export const productsByCategoryState = selectorFamily<Product[], string>({
  key: "productsByCategory",
  get:
    (categoryId) =>
    ({ get }) => {
      const allProducts = get(productsState);
      return allProducts.filter((product) =>
        product.categoryId.includes(categoryId)
      );
    },
});

export const cartState = atom<Cart>({
  key: "cart",
  default: [],
});

export const totalQuantityState = selector({
  key: "totalQuantity",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
});

export const totalPriceState = selector({
  key: "totalPrice",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce(
      (total, item) =>
        total + item.quantity * calcFinalPrice(item.product, item.options),
      0
    );
  },
});

export const notificationsState = atom<Notification[]>({
  key: "notifications",
  default: [
    {
      id: 1,
      image: logo,
      title: "Chào bạn mới",
      content:
        "Cảm ơn đã sử dụng Portal Bắc Ninh, bạn có thể dùng ứng dụng này để tiết kiệm thời gian xây dựng",
    },
    {
      id: 2,
      image: logo,
      title: "Giảm 50% lần đầu mua hàng",
      content: "Nhập WELCOME để được giảm 50% giá trị đơn hàng đầu tiên order",
    },
  ],
});

export const keywordState = atom({
  key: "keyword",
  default: "",
});

export const resultArticleState = selector<Article[]>({
  key: "resultArticleState",
  get: async ({ get }) => {
    const keyword = get(keywordState).trim();

    // 🔸 Nếu chưa nhập từ khóa, trả về rỗng
    if (!keyword) {
      return [];
    }

    try {
      const url = `${BASE_API}/${getArticles}&titleCut=${encodeURIComponent(
        keyword
      )}`;

      console.log("🔎 Fetching search articles:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Lỗi mạng: ${response.statusText}`);
      }

      const jsonData = await response.json();
      const articles = (jsonData?.data?.result || []) as Article[];

      console.log("✅ resultArticleState articles =", articles);

      return articles;
    } catch (error) {
      console.error("❌ Lỗi khi tìm kiếm bài viết:", error);
      return [];
    }
  },
});

export const resultState = selector<Product[]>({
  key: "result",
  get: async ({ get }) => {
    const keyword = get(keywordState);
    if (!keyword.trim()) {
      return [];
    }
    const products = get(productsState);
    await wait(500);
    return products.filter((product) =>
      product.name.trim().toLowerCase().includes(keyword.trim().toLowerCase())
    );
  },
});

export const storesState = atom<Store[]>({
  key: "stores",
  default: [
    {
      id: 1,
      name: "VNG Campus Store",
      address:
        "Khu chế xuất Tân Thuận, Z06, Số 13, Tân Thuận Đông, Quận 7, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.741639,
      long: 106.714632,
    },
    {
      id: 2,
      name: "The Independence Palace",
      address:
        "135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.779159,
      long: 106.695271,
    },
    {
      id: 3,
      name: "Saigon Notre-Dame Cathedral Basilica",
      address:
        "1 Công xã Paris, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.779738,
      long: 106.699092,
    },
    {
      id: 4,
      name: "Bình Quới Tourist Village",
      address:
        "1147 Bình Quới, phường 28, Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.831098,
      long: 106.733128,
    },
    {
      id: 5,
      name: "Củ Chi Tunnels",
      address: "Phú Hiệp, Củ Chi, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 11.051655,
      long: 106.494249,
    },
  ],
});

export const nearbyStoresState = selector({
  key: "nearbyStores",
  get: ({ get }) => {
    // Get the current location from the locationState atom
    const location = get(locationState);

    // Get the list of stores from the storesState atom
    const stores = get(storesState);

    // Calculate the distance of each store from the current location
    if (location) {
      const storesWithDistance = stores.map((store) => ({
        ...store,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          store.lat,
          store.long
        ),
      }));

      // Sort the stores by distance from the current location
      const nearbyStores = storesWithDistance.sort(
        (a, b) => a.distance - b.distance
      );

      return nearbyStores;
    }
    return [];
  },
});

export const selectedStoreIndexState = atom({
  key: "selectedStoreIndex",
  default: 0,
});

export const selectedStoreState = selector({
  key: "selectedStore",
  get: ({ get }) => {
    const index = get(selectedStoreIndexState);
    const stores = get(nearbyStoresState);
    return stores[index];
  },
});

export const selectedDeliveryTimeState = atom({
  key: "selectedDeliveryTime",
  default: +new Date(),
});

export const requestLocationTriesState = atom({
  key: "requestLocationTries",
  default: 0,
});

export const requestPhoneTriesState = atom({
  key: "requestPhoneTries",
  default: 0,
});

export const locationState = selector<
  { latitude: string; longitude: string } | false
>({
  key: "location",
  get: async ({ get }) => {
    const requested = get(requestLocationTriesState);
    if (requested) {
      const { latitude, longitude, token } = await getLocation({
        fail: console.warn,
      });
      if (latitude && longitude) {
        return { latitude, longitude };
      }
      if (token) {
        console.warn(
          "Sử dụng token này để truy xuất vị trí chính xác của người dùng",
          token
        );
        console.warn(
          "Chi tiết tham khảo: ",
          "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
        );
        console.warn("Giả lập vị trí mặc định: VNG Campus");
        return {
          latitude: "10.7287",
          longitude: "106.7317",
        };
      }
    }
    return false;
  },
});

export const phoneState = selector<string | boolean>({
  key: "phone",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested) {
      try {
        const { number, token } = await getPhoneNumber({ fail: console.warn });
        if (number) {
          return number;
        }
        console.warn(
          "Sử dụng token này để truy xuất số điện thoại của người dùng",
          token
        );
        console.warn(
          "Chi tiết tham khảo: ",
          "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
        );
        console.warn("Giả lập số điện thoại mặc định: 0337076898");
        return "0337076898";
      } catch (error) {
        // Xử lý exception
        console.error(error);
        return false;
      }
    }

    return false;
  },
});

export const orderNoteState = atom({
  key: "orderNote",
  default: "",
});
