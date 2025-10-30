import React, { useEffect, useState } from "react";
import { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useNavigate } from "react-router";
import { BASE_API, getConfigs, urlImage } from "../../api";
import { openWebview } from "zmp-sdk/apis";
import { useRecoilValue } from "recoil";
import { configsState } from "state";
import { IConfig } from "types";


export const Menus: FC = () => {
  const navigate = useNavigate();
  const configs = useRecoilValue(configsState); 

  const openUrlInWebview = async (url: string) => {
    try {
      //console.log("🧭 Try openWebview:", url);
      await openWebview({
        url,
        config: {
          style: "bottomSheet",
          leftButton: "back",
        },
      });
    } catch (error) {
      //console.warn("⚠️ openWebview failed, fallback to window.open", error);
      window.open(url, "_blank");
    }
  };

  const handleClick = (config: IConfig) => {
    if (config.url){
      if (config.type === 1 ) {
        //console.log("openUrlInWebview:"+ config.url)
        openUrlInWebview(config.url);
      } else {
        //console.log("url:"+config.url)
        navigate(config.url);
      }
    }
  };

  return (
    <Box className="bg-white grid grid-cols-4 gap-4 p-4">
      {configs.map((config, i) => (
        <div
          key={i}
          onClick={() => handleClick(config)}
          className="flex flex-col space-y-2 items-center cursor-pointer"
        >
          <img
            className="w-12 h-12"
            src={`${urlImage}config/${config.icon}`}
            alt={config.name}
          />
          <Text size="xxSmall" className="text-gray text-center">
            {config.name}
          </Text>
        </div>
      ))}
    </Box>
  );
};
