import React, { FC } from "react";
import { Divider } from "components/divider";
import { Box, Header, Icon, Page, Text, useSnackbar } from "zmp-ui";
import { ListRenderer } from "components/list-renderer";
import { logo_app, urlImage } from "api";
import { openWebview } from "zmp-sdk";
import { IHelpInfor } from "types";
import { helpInforsState } from "state";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";


const HelpInforPage: FC = () => {
  
  const { openSnackbar } = useSnackbar();

  const helpInforsLoadable  = useRecoilValueLoadable(helpInforsState); 

  if (helpInforsLoadable.state === "loading") {
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  }

  if (helpInforsLoadable.state === "hasError") {
    console.error(helpInforsLoadable.contents);
    return <div className="p-4 text-center text-red-500">Lỗi tải dữ liệu</div>;
  }

  const helpInfors = helpInforsLoadable.contents || [];

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
