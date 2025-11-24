import React, { useState } from "react";
import { Box, Button, Header, Icon, Page } from "zmp-ui";
import { getSystemInfo, openWebview } from "zmp-sdk";
import ExternalBrowserPopup from "components/pakn/externalBrowserPopup";

const PaknPage = () => {

  const [showPopup, setShowPopup] = useState(false);
  const linkIos = "https://apps.apple.com/vn/app/phản-ánh-kiến-nghị/id1492609721?l=vi";
  const linkAndroid = "";

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

  const handleDownload = () => {
    openUrlInWebview("https://paht.bacninh.gov.vn/");
  }

  const openBrowser = () => {
    setShowPopup(true);
  }

  return (
    <Page className="min-h-0 bg-white">
      <Header title="Phản ánh hiện trường" />
      <div className="w-full h-full mt-2 px-4 flex-col">
        <Button suffixIcon={<Icon icon="zi-download" />} onClick={openBrowser} className="w-full mt-5">
          Gửi phản ánh
        </Button>
        <Button suffixIcon={<Icon icon="zi-unhide" />} onClick={handleDownload} className="w-full mt-5">
          Xem danh sách phản ánh
        </Button>
      </div>
      <ExternalBrowserPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        link={getSystemInfo().platform === "android" ? linkAndroid : linkIos}
      />
    </Page>
  )
}

export default PaknPage;