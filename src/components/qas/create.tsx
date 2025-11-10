import { appId, BASE_API, postQAS } from "api";
import React, { useState } from "react";
import { Box, Button, Page, Input, useSnackbar, Modal, Header } from "zmp-ui";

const CreateQAS = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const { openSnackbar } = useSnackbar();

  // ✅ Validate email
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ✅ Validate phone VN
  const validatePhone = (phone: string) => {
    const regex = /^(0|\+?84)(\d{9})$/;
    return regex.test(phone);
  };

  const submit = () => {
    const trimmedName = name.trim();
    const trimmedContent = content.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    // ⚠️ Kiểm tra bắt buộc
    if (!trimmedName) {
      openSnackbar({ text: "Vui lòng nhập họ tên!", type: "error" });
      return;
    }
    if (!trimmedPhone) {
      openSnackbar({ text: "Vui lòng nhập số điện thoại!", type: "error" });
      return;
    }
    if (!trimmedEmail) {
      openSnackbar({ text: "Vui lòng nhập email!", type: "error" });
      return;
    }
    if (!trimmedContent) {
      openSnackbar({ text: "Vui lòng nhập nội dung câu hỏi!", type: "error" });
      return;
    }

    // ⚠️ Kiểm tra định dạng
    if (!validatePhone(trimmedPhone)) {
      openSnackbar({
        text: "Số điện thoại không hợp lệ! (VD: 090xxxxxxx hoặc +8490xxxxxxx)",
        type: "error",
      });
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      openSnackbar({
        text: "Email không hợp lệ! (VD: ten@domain.com)",
        type: "error",
      });
      return;
    }

    // ✅ Nếu hợp lệ, gửi API
    fetch(`${BASE_API}/${postQAS}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameQ: trimmedName,
        phoneQ: trimmedPhone,
        emailQ: trimmedEmail,
        timeQ: new Date().toISOString(),
        contentQ: trimmedContent,
        app: { id: `${appId}` },
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(() => {
        openSnackbar({ text: "Gửi câu hỏi thành công!", type: "success" });
        setDialogVisible(true);
        // ✅ Reset form
        setName('');
        setPhone('');
        setEmail('');
        setContent('');
      })
      .catch(() => {
        openSnackbar({
          text: "Gửi thất bại, vui lòng thử lại sau!",
          type: "error",
        });
      });
  };

  return (
    <Page className="min-h-0 bg-white">
      <Header title="Gửi câu hỏi" />
      <Box mx={4} my={4}>
        <div style={{ borderRadius: "10px", marginTop: "10px", padding: "20px" }}>
          <Input
            label="Họ tên (*)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
          />
          <Input
            label="Số điện thoại (*)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
          <Input
            label="Email (*)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
          <Input.TextArea
            label="Câu hỏi (*)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung câu hỏi"
          />
        </div>
        <br />
        <Button fullWidth onClick={submit} size="large">
          Gửi câu hỏi
        </Button>
      </Box>

      <Modal
        visible={dialogVisible}
        title="Gửi thành công"
        onClose={() => {
          setDialogVisible(false);
          window.history.back();
        }}
        description="Cảm ơn bạn đã gửi câu hỏi. Chúng tôi sẽ trả lời sớm nhất!"
      />
    </Page>
  );
};

export default CreateQAS;
