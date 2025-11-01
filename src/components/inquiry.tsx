import React, { Suspense } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Tabs } from "zmp-ui";
import {
  listCateState,
  selectedCategoryState,
  activeCategoryState,
  pageInfor,
} from "../state";

const QuickFilter: React.FC = () => {
  const categories = useRecoilValue(listCateState);
  const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryState);
  const activeCategory = useRecoilValue(activeCategoryState); // ✅ tự động lấy ID đầu tiên nếu chưa chọn
  const [page, setPage] = useRecoilState(pageInfor);

  const handleChangeCategory = (key: string) => {
    const id = parseInt(key);
    if (id !== selectedCategory) {
      setSelectedCategory(id);
      // Reset trang khi đổi category (nếu cần)
      setPage((prev) => ({ ...prev, pagenumber: 1 }));
    }
  };

  return (
    <Tabs
      scrollable
      activeKey={String(activeCategory)} // ✅ Tabs hiển thị theo danh mục hiện tại
      onChange={handleChangeCategory}
      className="category-tabs bg-transparent"
    >
      {categories.map((cat) => (
        <Tabs.Tab key={String(cat.id)} label={cat.name} className="px-2">
          <Suspense fallback={<div>Đang tải...</div>}>
            {/* Có thể thêm nội dung theo danh mục nếu cần */}
          </Suspense>
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

export default QuickFilter;
