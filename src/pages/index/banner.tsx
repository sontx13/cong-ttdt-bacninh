import React, { FC, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import { Box } from "zmp-ui";
import { BASE_API,urlImage,getBanners } from "../../api";
import { openWebview } from "zmp-sdk";
import { useRecoilValue } from "recoil";
import { bannersState } from "state";

export const Banner: FC = () => {
 
  const banners = useRecoilValue(bannersState);

  const openUrlInWebview = async (url: string) => {
    if (!url) return;
    try {
      console.log("🧭 Try openWebview:", url);
      await openWebview({
        url,
        config: {
          style: "bottomSheet",
          leftButton: "back",
        },
      });
    } catch (error) {
      console.warn("⚠️ openWebview failed, fallback to window.open", error);
      window.open(url, "_blank");
    }
  };

  return (
    <Box className="bg-white" pb={4}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        cssMode
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="px-4">
            <Box
              onClick={() => openUrlInWebview(banner.url)}
              className="w-full rounded-lg aspect-[2/1] bg-cover bg-center bg-skeleton block cursor-pointer"
              style={{
                backgroundImage: `url(${urlImage + "banner/" + banner.image})`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
