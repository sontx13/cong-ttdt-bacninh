import React, { FC, useEffect, useState } from "react";
import { Divider } from "components/divider";
import { Box, Button, Header, Icon, Page, Text, useSnackbar } from "zmp-ui";
import { ListRenderer } from "components/list-renderer";
import { BASE_API, getInfors, logo_app, urlImage } from "api";
import { openPhone, openWebview } from "zmp-sdk";

interface IHelpInfor {
  id: number;
  name: string;
  url: string;
  icon?: string;
}

const HelpInforPage: FC = () => {
  const [helpInfors, setInfors] = useState<IHelpInfor[]>([]);
  const { openSnackbar } = useSnackbar();

  const fetchInfors = async () => {
    try {
      const response = await fetch(`${BASE_API}/${getInfors}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      //console.log("📦 Infors API response:", JSON.stringify(jsonData));
      setInfors(jsonData.data?.result || []);
    } catch (error) {
      //console.error("Error fetching Infors:", error);
    }
  };

  useEffect(() => {
    fetchInfors();
  }, []);

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

  const handleClick = (infor: IHelpInfor) => {
    if (infor.url){
      
        openUrlInWebview(infor.url);
      } else {
        //console.log("url:"+config.url)
        openSnackbar({
          text: "Chưa có nội dung",
          type: "warning",
        });
      }
  }
 
  // Tạo danh sách hiển thị phù hợp cho ListRenderer
  const inforItems = helpInfors.map((infor) => ({
    left: (
      <img
        className="w-5 h-5  object-cover"
        src={`${urlImage + "infor/" + infor.icon}` || logo_app}
        alt="infor"
      />
    ),
    right: (
      <Box flex className="space-x-2 items-center" onClick={() => handleClick(infor)} > 
        <Box className="flex-1 space-y-[2px]">
          <Text.Header className="font-normal">
            {infor.name || "Thông tin trợ giúp"}
          </Text.Header>
        </Box>
        <Icon icon="zi-chevron-right" />
      </Box>
    ),
  }));

  return (
    <Page className="flex flex-col">
      <Header title="Thông tin trợ giúp" showBackIcon={false} />
      <Box>
        <ListRenderer
          items={inforItems}
          limit={10}
          renderLeft={(item) => item.left}
          renderRight={(item) => item.right}
        />
      </Box>
      <Divider size={12} />
      <Divider size={32} className="flex-1" />
    </Page>
  );
};

export default HelpInforPage;
