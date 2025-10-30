import ArticleItem from "components/post/article";
import NewsItem from "components/post/news";
import { Section } from "components/section";
import { ProductSlideSkeleton } from "components/skeletons";
import React, { Suspense } from "react";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { hotNewsState } from "state";
import { Swiper, SwiperSlide } from "swiper/react";
import { Article } from "types/article";
import { Box, Text } from "zmp-ui";

export const HotnewContent: FC = () => {
  const hotNews = useRecoilValue<Article[]>(hotNewsState);
  //const hotNews = useRecoilValueLoadable(hotNewsState);
  //console.log("hotNews"+JSON.stringify(hotNews));

  return (
    <Section title="Tin nổi bật" padding="title-only">
      <Swiper slidesPerView={1.25} spaceBetween={16} className="px-4">
        {hotNews.map((news) => (
          <SwiperSlide key={news.id}>
          
          <NewsItem
                layout="cover"
                article={news}
              />
            
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
};

export const HotnewFallback: FC = () => {
  const recommendProducts = [...new Array(3)];

  return (
    <Section title="Tin nổi bật" padding="title-only">
      <Swiper slidesPerView={1.25} spaceBetween={16} className="px-4">
        {recommendProducts.map((_, i) => (
          <SwiperSlide key={i}>
            <ProductSlideSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
};

export const Hotnew: FC = () => {
  return (
    <Suspense fallback={<HotnewFallback />}>
      <HotnewContent />
    </Suspense>
  );
};
