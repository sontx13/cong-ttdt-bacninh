import React, { useEffect, useState, Suspense } from "react";
import { Page, Box, Text, Icon, Header, Tabs } from "zmp-ui";
import { useRecoilValueLoadable, useRecoilState, useRecoilValue } from "recoil";
import {
  categoryNewsState,
  selectedCategoryState,
  listCategoryState,
  pageInfor,
} from "../state";
import { Divider } from "../components/divider";
import { img_loading } from "api";
import ArticleItem from "components/post/article";
import "../css/custom.css";

const { Title } = Text;

// =================== COMPONENT HIỂN THỊ DANH SÁCH =================== //
interface PopularProps {
  news: any[];
  categoryId: number;
}

const Popular: React.FC<PopularProps> = ({ news, categoryId }) => {
  const filtered = news.filter((n) => n.cat_id === categoryId);
  const [visibleList, setVisibleList] = useState<any[]>([]);
  const [chunk, setChunk] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setVisibleList(filtered.slice(0, chunk));
  }, [categoryId, news]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop !== target.clientHeight) return;
    if (chunk >= filtered.length) return;
    setIsLoading(true);

    setTimeout(() => {
      setVisibleList((prev) => [
        ...prev,
        ...filtered.slice(chunk, chunk + 50),
      ]);
      setChunk((prev) => prev + 50);
      setIsLoading(false);
    }, 1000);
  };

  if (!filtered.length) {
    return <Box mx={4}>Không có tin tức trong chuyên mục này</Box>;
  }

  return (
    <Box onScroll={handleScroll} className=" h-screen">
      {visibleList.map((item) => (
        <Box key={item.id} m={3}>
          <ArticleItem layout="cover" article={item} activeCate={categoryId} />
        </Box>
      ))}
      {isLoading && (
        <div className="div-loading flex justify-center p-4">
          <img src={img_loading} alt="loading" className="img-register" />
        </div>
      )}
    </Box>
  );
};

// =================== COMPONENT CHÍNH =================== //
const PostPage: React.FC = () => {
  const newsLoadable = useRecoilValueLoadable(categoryNewsState);
  const categories = useRecoilValue(listCategoryState);
  const [activeCategory, setActiveCategory] =
    useRecoilState(selectedCategoryState);

  if (newsLoadable.state === "loading") {
    return (
      <Page className="bg-white flex justify-center items-center h-screen">
        <Icon icon="zi-backup-arrow-solid" className="text-blue-500 animate-spin w-10 h-10"/>
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
    <Page className="flex flex-col bg-white">
      <Header title="Danh sách tin tức" />
      <Tabs
        scrollable
        activeKey={String(activeCategory)}
        onChange={(key) => setActiveCategory(parseInt(key))}
        className="category-tabs bg-transparent"
      >
        {categories.map((cat) => (
          <Tabs.Tab key={String(cat.id)} label={cat.name}>
            <Suspense fallback={<div>Đang tải...</div>}>
              <Popular news={news} categoryId={cat.id} />
            </Suspense>
          </Tabs.Tab>
        ))}
      </Tabs>
    </Page>
  );
};

// =================== EXPORT =================== //
const PostPageWithSuspense: React.FC = () => (
  <Suspense
    fallback={
      <Page className="flex justify-center items-center h-screen bg-white">
        {/* <img src={img_loading} alt="loading" className="w-12 h-12 animate-spin" /> */}
        <Icon icon="zi-backup-arrow-solid" className="text-blue-500 animate-spin w-10 h-10"/>
      </Page>
    }
  >
    <PostPage />
  </Suspense>
);

export default PostPageWithSuspense;
