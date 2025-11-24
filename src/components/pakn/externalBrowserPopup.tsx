import React, { useState } from "react";
import { Modal, Button } from "zmp-ui";

export default function ExternalBrowserPopup({
  link,
  open,
  onClose,
}: {
  link: string;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Không thể copy tự động, vui lòng copy thủ công: " + link);
    }
  };

  return (
    <Modal
      visible={open}
      onClose={onClose}
      className="rounded-2xl p-4 bg-white shadow-xl"
      // overlayClassName="bg-black/40 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold mb-2">
          Tải app Phản ánh kiến nghị
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Vui lòng copy link bên dưới, sau đó mở Chrome/Safari và dán link để tải app và gửi phản ánh
        </p>

        <div className="w-full bg-gray-100 rounded-xl p-3 flex items-center justify-between">
          <span className="text-[13px] text-gray-800 break-all mr-3">
            {link}
          </span>

          <Button
            onClick={handleCopy}
            className="!bg-blue-600 !text-white !px-3 !py-1 !rounded-lg"
          >
            {copied ? "✔ Đã copy" : "Copy"}
          </Button>
        </div>

        {/* <p className="text-xs text-gray-500 italic mt-3">
          Sau khi copy, hãy mở Chrome/Safari và dán link để tải app và gửi phản ánh.
        </p> */}

        <Button
          className="mt-4 w-full bg-gray-200 text-red-800 rounded-xl"
          onClick={onClose}
        >
          Đóng
        </Button>
      </div>
    </Modal>
  );
}
