import React, { FC, useEffect } from "react";
import {
  Avatar,
  Box,
  Header,
  Icon,
  Page,
  Text,
  useSnackbar,
} from "zmp-ui";
import { ListRenderer } from "components/list-renderer";
import { useToBeImplemented } from "hooks";
import {
  addRating,
  createShortcut,
  favoriteApp,
  followOA,
  getAppInfo,
  getUserInfo,
  openPhone,
  openShareSheet,
} from "zmp-sdk";
import { logo_app } from "api";
import { useRecoilState } from "recoil";
import { userState } from "state";

// ---------------- Subscription ----------------
const Subscription: FC = () => {
  const [user, setUser] = useRecoilState(userState);

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      if (userInfo) {
        setUser({
          id: userInfo.id || "",
          name: userInfo.name || "",
          avatar: userInfo.avatar || "",
        });
      }
    } catch (error) {
      console.log("getUserInfo error:", error);
    }
  };

  // Nếu user chưa có dữ liệu thì tự động lấy 1 lần
  useEffect(() => {
    if (!user?.id) getUser();
  }, []);

  return (
    <Box className="m-4" onClick={getUser}>
      <Box
        flex
        alignItems="center"
        className="rounded-xl p-4 bg-white space-x-4"
      >
        <Avatar
          className="shadow align-middle mb-2"
          src={user?.avatar || ""}
        />
        <Box>
          <Text.Title>
            {user?.name ? `Chào, ${user.name}!` : "Công dân"}
          </Text.Title>
          {!user?.name && (
            <Text size="small" className="text-gray-500">
              Vui lòng cung cấp tên và ảnh đại diện
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// ---------------- Personal ----------------
const Personal: FC = () => {
  const { openSnackbar } = useSnackbar();

  const getFollow = async () => {
    try {
      await followOA({ id: "2372820049121447724" });
      openSnackbar({ text: "Cảm ơn bạn đã quan tâm OA!", type: "success" });
    } catch (error: any) {
      console.log("followOA error:", error);
      if (error.code === -201) {
        openSnackbar({
          text: "Bạn đã từ chối. Hãy thử lại để quan tâm OA nhé!",
          type: "warning",
        });
      } else {
        openSnackbar({
          text: "Bạn đã quan tâm Zalo OA rồi",
          type: "info",
        });
      }
    }
  };

  return (
    <Box className="m-4">
      <ListRenderer
        title="Quan tâm Zalo OA"
        items={[
          {
            left: (
              <img
                className="w-10 h-10 rounded-full"
                src={logo_app}
                alt="OA"
              />
            ),
            right: (
              <Box flex className="space-x-2" onClick={getFollow}>
                <Text.Title className="flex-1 items-center font-normal">
                  Cổng Thông tin điện tử tỉnh Bắc Ninh
                </Text.Title>
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

// ---------------- Other ----------------
const Other: FC = () => {
  const { openSnackbar } = useSnackbar();

  const pinAppUrl = async () => {
    try {
      const { version } = await getAppInfo();
      console.log("version=="+version);
      if (version !== "") {
        openSnackbar({
          text: "Chức năng này chỉ hoạt động trong môi trường Zalo chính thức",
          type: "warning",
        });
        return;
      }
  
      await createShortcut({ params: { utm_source: "shortcut" } });
      openSnackbar({
        text: "Tạo lối tắt ứng dụng thành công",
        type: "success",
      });
    } catch (error: any) {
      console.log("createShortcut error:", error);
      openSnackbar({
        text:
          error?.message ||
          "Không thể tạo lối tắt (ứng dụng chưa được cấp quyền)",
        type: "warning",
      });
    }
  };
  

  const shareAppUrl = async () => {
    try {
      const { appUrl } = await getAppInfo();
      await openShareSheet({
        type: "link",
        data: { link: appUrl, chatOnly: false },
      });
      openSnackbar({ text: "Chia sẻ thành công", type: "success" });
    } catch (error) {
      openSnackbar({ text: "Không thể chia sẻ ứng dụng", type: "warning" });
      console.log(error);
    }
  };

  const shareQrCodeUrl = async () => {
    try {
      const { qrCodeUrl } = await getAppInfo();
      await openShareSheet({
        type: "link",
        data: { link: qrCodeUrl, chatOnly: false },
      });
      openSnackbar({ text: "Chia sẻ mã QR thành công", type: "success" });
    } catch (error) {
      openSnackbar({ text: "Không thể chia sẻ mã QR", type: "warning" });
      console.log(error);
    }
  };

  const openCallScreen = async () => {
    try {
      await openPhone({ phoneNumber: "02223898777" });
    } catch (error) {
      openSnackbar({ text: "Không thể gọi điện", type: "warning" });
      console.log(error);
    }
  };

  const callAddRating = async () => {
    try {
      await addRating();
      openSnackbar({ text: "Cảm ơn bạn đã đánh giá!", type: "success" });
    } catch (error: any) {
      if (error.code === -201) {
        openSnackbar({
          text: "Bạn đã từ chối đánh giá.",
          type: "warning",
        });
      } else {
        openSnackbar({
          text: "Bạn đã từng đánh giá ứng dụng.",
          type: "info",
        });
      }
    }
  };

  const callFavoriteApp = async () => {
    try {
      await favoriteApp();
      openSnackbar({ text: "Đã thêm vào yêu thích!", type: "success" });
    } catch (error: any) {
      if (error.code === -201) {
        openSnackbar({
          text: "Bạn đã từ chối. Thử lại để thêm yêu thích nhé!",
          type: "warning",
        });
      } else {
        openSnackbar({
          text: "Ứng dụng đã nằm trong danh sách yêu thích",
          type: "info",
        });
      }
    }
  };

  return (
    <Box className="m-4">
      <ListRenderer
        title="Tiện ích"
        items={[
          {
            left: <Icon icon="zi-pin" className="my-auto" />,
            right: (
              <Box flex className="space-x-2" onClick={pinAppUrl}>
                <Text.Header className="flex-1 font-normal">
                  Tạo lối tắt ứng dụng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-share" className="my-auto" />,
            right: (
              <Box flex className="space-x-2" onClick={shareAppUrl}>
                <Text.Header className="flex-1 font-normal">
                  Chia sẻ ứng dụng qua link
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-qrline" className="my-auto" />,
            right: (
              <Box flex className="space-x-2" onClick={shareQrCodeUrl}>
                <Text.Header className="flex-1 font-normal">
                  Chia sẻ ứng dụng qua mã QR
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-call" className="my-auto" />,
            right: (
              <Box flex className="space-x-2" onClick={openCallScreen}>
                <Text.Header className="flex-1 font-normal">
                  Liên hệ góp ý
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-heart" className="my-auto" />,
            right: (
              <Box flex className="space-x-2" onClick={callFavoriteApp}>
                <Text.Header className="flex-1 font-normal">
                  Yêu thích ứng dụng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-star" className="my-auto" />,
            right: (
              <Box flex className="space-x-2" onClick={callAddRating}>
                <Text.Header className="flex-1 font-normal">
                  Đánh giá ứng dụng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

// ---------------- Page ----------------
const MyProfilePage: FC = () => {
  return (
    <Page>
      <Header showBackIcon={false} title="&nbsp;" />
      <Subscription />
      <Personal />
      <Other />
    </Page>
  );
};

export default MyProfilePage;
