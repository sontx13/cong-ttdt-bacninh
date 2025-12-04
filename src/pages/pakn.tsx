import React, { useState } from "react";
import { Box, Button, Header, Icon, Page } from "zmp-ui";
import { getSystemInfo, openWebview } from "zmp-sdk";
import ExternalBrowserPopup from "components/pakn/externalBrowserPopup";
import { urlImage } from "api";
import { saveImageToGallery, scanQRCode } from "zmp-sdk/apis";

const linkIconIos = `${urlImage}infor/1764822625105-apple.png`;
const linkIconAndroid = `${urlImage}infor/1764822691099-android.png`;
const linkIconTask = `${urlImage}infor/1764822710282-task.png`;

const PaknPage = () => {

  const [showPopup, setShowPopup] = useState(false);
  const linkIos = "https://apps.apple.com/vn/app/phản-ánh-kiến-nghị/id1492609721?l=vi";
  const linkAndroid = "https://play.google.com/store/apps/details?id=com.pakn";
  const linkQrIos = `${urlImage}infor/1764034770133-qr-codeIos.png`;
  const linkQrAndroid = `${urlImage}infor/1764034813699-qr-codeAndroid.png`

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

  const handleDownloadQr = async () => {
    await saveImageToGallery ({
      imageUrl: getSystemInfo().platform === "android" ? linkQrAndroid : linkQrIos
    });
    console.log("Lưu ảnh thành công!");
  };

  const handleScanQrCode = async () => {
    const {content} = await scanQRCode({});
    await openWebview({
      url: content,
      config: {
        style: "normal",
      },
    })
  }

  return (
    <Page className="min-h-0 bg-white">
      <Header title="Phản ánh hiện trường" />
      <div className="w-full h-full mt-2 px-4 flex flex-col  bg-slate-400">
        <div>
          <img src={linkIconIos}
            className="w-[30%]"
          />
          <span>Link tải IOS</span>
        </div>
        <div>
          <img src={linkIconAndroid}
            className="w-[30%]"
          />
          <span>Link tải ANDRIOD</span>
        </div>
        <div>
          <img src={linkIconTask} onClick={handleDownload}
            className="w-[30%]"
          />
          <span>Xem danh sách phản ánh</span>
        </div>
        {/* <Button suffixIcon={<Icon icon="zi-download" />} onClick={openBrowser} className="w-full mt-5">
          Gửi phản ánh
        </Button>
        <Button suffixIcon={<Icon icon="zi-unhide" />} onClick={handleDownload} className="w-full mt-5">
          Xem danh sách phản ánh
        </Button>
        <img src={getSystemInfo().platform === "android" ? linkQrAndroid : linkQrIos}
          className="w-[100%]"
        />
        <Button suffixIcon={<Icon icon="zi-qrline" />} onClick={handleDownloadQr} className="w-full mt-5">
          Lưu QR
        </Button>
        <Button suffixIcon={<Icon icon="zi-qrline" />} onClick={handleScanQrCode} className="w-full mt-5">
          Scan QR
        </Button> */}
      </div>
      {/* <ExternalBrowserPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        link={getSystemInfo().platform === "android" ? linkAndroid : linkIos}
      /> */}
    </Page>
  )
}

export default PaknPage;