import React, { useEffect, useState, Suspense } from "react";
import { Page, Box, Text, Icon } from "zmp-ui";
import { QuickFilter } from "../components/inquiry";
import { useRecoilValueLoadable, useRecoilState } from "recoil";
import { categoryNewsState, selectedCategoryState, pageInfor } from "../state";
import { Divider } from "../components/divider";
import { linK_web, logo_app, img_loading } from "api";
import { openWebview } from "zmp-sdk";
import ArticleItem from "components/post/article";
import "../css/custom.css";
import { useNavigate } from "react-router";

const { Title } = Text;

// =================== COMPONENT PHỤ =================== //
interface PopularProps {
  news: any[];
  articleList: any[];
  setArticleList: React.Dispatch<React.SetStateAction<any[]>>;
  activeCategory: number;
}

const Popular: React.FC<PopularProps> = ({
  news,
  articleList,
  setArticleList,
  activeCategory,
}) => {
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [chunk, setChunk] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  // Nạp dữ liệu lần đầu và khi đổi danh mục
  useEffect(() => {
    if (!Array.isArray(news)) return;
    setArticleList(news.slice(0, chunk));
  }, [activeCategory, news]);

  // Xử lý scroll load thêm
  useEffect(() => {
    if (!isLoadMore) return;
    setIsLoading(true);

    const timer = setTimeout(() => {
      setArticleList((prev) => [
        ...prev,
        ...news.slice(chunk, chunk + 50),
      ]);
      setChunk((prev) => prev + 50);
      setIsLoadMore(false);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoadMore]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop !== target.clientHeight) return;
    setIsLoadMore(true);
  };

  if (!Array.isArray(articleList) || !articleList.length) {
    return <Box mx={4}>Không có tin tức mới hiển thị</Box>;
  }

  return (
    <Page restoreScrollOnBack className="bg-white">
      <Box className="overflow-auto snap-x snap-mandatory scroll-p-4 no-scrollbar">
        <Box onScroll={handleScroll} className="overflow-y-auto h-screen">
          {articleList.map((item) => (
            <Box key={item.id} m={3} className="snap-start">
              <ArticleItem
                layout="cover"
                article={item}
                activeCate={activeCategory}
              />
            </Box>
          ))}
        </Box>

        {isLoading && (
          <div className="div-loading flex justify-center p-4">
            <img src={img_loading} alt="loading" className="img-register" />
          </div>
        )}
      </Box>
    </Page>
  );
};

// =================== HÀM PHỤ =================== //
const getFormattedDate = (date: Date) => {
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const monthsOfYear = [
    "tháng 1",
    "tháng 2",
    "tháng 3",
    "tháng 4",
    "tháng 5",
    "tháng 6",
    "tháng 7",
    "tháng 8",
    "tháng 9",
    "tháng 10",
    "tháng 11",
    "tháng 12",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = monthsOfYear[date.getMonth()];
  const year = date.getFullYear();
  return `${dayOfWeek}, ${day} ${month}, ${year}`;
};

const openUrlInWebview = async () => {
  try {
    await openWebview({
      url: linK_web,
      config: {
        style: "bottomSheet",
        leftButton: "back",
      },
    });
  } catch (error) {
    console.error("Open Webview error:", error);
  }
};

// =================== COMPONENT CHÍNH =================== //
const PostPage: React.FC = () => {
  const newsLoadable = useRecoilValueLoadable(categoryNewsState);
  const [activeCategory, setActiveCategory] =
    useRecoilState(selectedCategoryState);
  const [page, setPageInfor] = useRecoilState(pageInfor);
  const [articleList, setArticleList] = useState<any[]>([]);
  const [showText, setShowText] = useState(true);
  const navigate = useNavigate(); 

  const onChangeActiveCategory = (id: number) => setActiveCategory(id);

  useEffect(() => {
    const interval = setInterval(
      () => setShowText((prev) => !prev),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  const currentDate = new Date();
  const formattedDate = getFormattedDate(currentDate);

  // Xử lý trạng thái loadable (loading/error/hasValue)
  if (newsLoadable.state === "loading") {
    return (
      <Page className="bg-white flex justify-center items-center h-screen">
        <img src={img_loading} alt="loading" className="w-12 h-12 animate-spin" />
      </Page>
    );
  }

  if (newsLoadable.state === "hasError") {
    return (
      <Page className="bg-white flex justify-center items-center h-screen">
        <Text className="text-red-500">Không thể tải dữ liệu tin tức</Text>
      </Page>
    );
  }

  const news = (newsLoadable.contents as any[]) || [];

  return (
    <Page restoreScrollOnBack className="bg-white">
 
      <Box onClick={() => navigate("/")}>
        <Icon icon="zi-chevron-left" className="object-cover img-logo" />
      </Box>

      <Box mx={3} mb={2} mt={0} style={{ marginLeft: "40px", width: "65%", marginTop:"50px" }}>
        <QuickFilter
          activeCategory={activeCategory}
          onChangeActiveCategory={onChangeActiveCategory}
        />
      </Box>

   

      {/* {showText ? (
        <Text className="sub_header" onClick={openUrlInWebview}>
          Cổng TTĐT Bắc Ninh
        </Text>
      ) : (
        <Text className="sub_header" onClick={openUrlInWebview}>
          {formattedDate}
        </Text>
      )} */}

      {/* <Divider size={15} /> */}

      <Popular
        news={news}
        articleList={articleList}
        setArticleList={setArticleList}
        activeCategory={activeCategory}
      />
    </Page>
  );
};

// =================== EXPORT CÓ SUSPENSE =================== //
const PostPageWithSuspense: React.FC = () => (
  <Suspense
    fallback={
      <Page className="flex justify-center items-center h-screen bg-white">
        <img src={img_loading} alt="loading" className="w-12 h-12 animate-spin" />
      </Page>
    }
  >
    <PostPage />
  </Suspense>
);

export default PostPageWithSuspense;
