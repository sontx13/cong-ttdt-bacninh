import React, { FC, useEffect, useState } from "react";
import { Divider } from "components/divider";
import { Box, Button, Header, Page, Text } from "zmp-ui";
import { ListRenderer } from "components/list-renderer";
import { BASE_API, getHotlines, logo_app, urlImage } from "api";
import { openPhone } from "zmp-sdk";

interface IHotline {
  id: number;
  name: string;
  phone_number: string;
  icon?: string;
}

const HotlinePage: FC = () => {
  const [hotlines, setHotlines] = useState<IHotline[]>([]);

  const fetchHotlines = async () => {
    try {
      const response = await fetch(`${BASE_API}/${getHotlines}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      //console.log("📦 Hotlines API response:", JSON.stringify(jsonData));
      setHotlines(jsonData.data?.result || []);
    } catch (error) {
      //console.error("Error fetching Hotlines:", error);
    }
  };

  useEffect(() => {
    fetchHotlines();
  }, []);

  // Tạo danh sách hiển thị phù hợp cho ListRenderer
  const hotlineItems = hotlines.map((hotline) => ({
    left: (
      <img
        className="w-10 h-10  object-cover"
        src={`${urlImage + "hotline/" + hotline.icon}` || logo_app}
        alt="hotline"
      />
    ),
    right: (
      <Box flex className="space-x-2 items-center">
        <Box className="flex-1 space-y-[2px]">
          <Text.Header className="font-normal">
            {hotline.name || "Đường dây nóng"}
          </Text.Header>
        </Box>
        <Button
          type="highlight"
          size="small"
          onClick={() => openPhone({ phoneNumber: hotline.phone_number })}
        >
          {hotline.phone_number}
        </Button>
      </Box>
    ),
  }));

  return (
    <Page className="flex flex-col">
      <Header title="Đường dây nóng" showBackIcon={false} />
      <Box>
        <ListRenderer
          items={hotlineItems}
          limit={4}
          renderLeft={(item) => item.left}
          renderRight={(item) => item.right}
        />
      </Box>
      <Divider size={12} />
      <Divider size={32} className="flex-1" />
    </Page>
  );
};

export default HotlinePage;
