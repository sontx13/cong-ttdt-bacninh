import React, { FC } from "react";
import { Divider } from "components/divider";
import { Header, Page } from "zmp-ui";

import { Delivery } from "./delivery";
import { useVirtualKeyboardVisible } from "hooks";

const CartPage: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();

  return (
    <Page className="flex flex-col">
      <Header title="Giỏ hàng" showBackIcon={false} />

      <Delivery />
      <Divider size={12} />
 
      <Divider size={32} className="flex-1" />

    </Page>
  );
};

export default CartPage;
