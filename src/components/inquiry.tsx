import React, { Suspense } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, Button, Input, Tabs } from "zmp-ui";
import {
  keywordState,
  listCategoryState,
  pageInfor,
} from "../state";


export function QuickFilter({activeCategory, onChangeActiveCategory}) {
  
  const [page, setPage] = useRecoilState(pageInfor);

  const categories = useRecoilValue(listCategoryState);

  return (
    <Tabs
    scrollable
    activeKey={String(activeCategory)} // Tabs key là string
    onChange={(key) => {
      const id = parseInt(key);
      onChangeActiveCategory(id);
      console.log(id, "id new");
      console.log(activeCategory, "activecategory-=-=-");
    }}
    className="category-tabs bg-transparent"
  >
    {categories.map((categorie) => (
      <Tabs.Tab
        key={String(categorie.id)}
        label={categorie.name}
        className="px-2"
      >
          <Suspense fallback={<div>Đang tải...</div>}>
            {/* Chỗ này có thể render nội dung theo category nếu cần */}
          </Suspense>
        </Tabs.Tab>
      ))}
    </Tabs>


    // <div className="overflow-auto no-scrollbar snap-x snap-mandatory mt-4 bg-transparent">
    //   <div className="flex w-max ds-chuyenmuc">
    //     {categories.map((categorie) => (
    //       <Button
    //         key={categorie.id}
    //         size="small"
    //         type="highlight"
    //         variant={
    //           activeCategory === categorie.id ? "primary" : "secondary"
    //         }
    //         className=""
    //         onClick={() => {
    //           onChangeActiveCategory(categorie.id);
    //           console.log(categorie.id, "id new");
    //           console.log(activeCategory, "activecategory-=-=-");
              
              
    //         }}
    //       >
    //         {categorie.name}
    //       </Button>
    //     ))}
    //   </div>
    // </div>
  );
}

export default QuickFilter;
