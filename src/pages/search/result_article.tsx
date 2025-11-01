import React, { FC, Suspense } from "react";
import { useRecoilValue } from "recoil";
import { resultArticleState } from "state";
import { Box, Text, Icon } from "zmp-ui";
import NewsItem from "components/post/news";

// ========================== COMPONENT HIỂN THỊ KẾT QUẢ ========================== //
const SearchresultArticleContent: FC = () => {
  const resultArticle = useRecoilValue(resultArticleState);

  return (
    <Box flex flexDirection="column" className="bg-background flex-1 min-h-0">
      <Text.Title className="p-4 pt-0" size="small">
        Kết quả ({resultArticle.length})
      </Text.Title>

      {resultArticle.length > 0 ? (
        <Box className="p-4 pt-0 space-y-4 flex-1 overflow-y-auto">
          {resultArticle.map((article) => (
            <Box key={article.id}>
               <NewsItem
                layout="cover"
                article={article}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box className="flex-1 flex justify-center items-center pb-24">
          <Text size="xSmall" className="text-gray">
            Không tìm thấy kết quả. Vui lòng thử lại
          </Text>
        </Box>
      )}
    </Box>
  );
};

// ========================== FALLBACK KHI ĐANG LOAD ========================== //
const SearchresultArticleFallback: FC = () => {
  const loadingItems = Array.from({ length: 5 });
  return (
    <Box flex flexDirection="column" className="bg-background flex-1 min-h-0">
      <Text.Title className="p-4 pt-0" size="small">
        Đang tìm kiếm...
      </Text.Title>
      <Box className="p-4 pt-0 space-y-4 flex-1 overflow-y-auto">
        {loadingItems.map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 h-28 rounded-xl"
          ></div>
        ))}
      </Box>
    </Box>
  );
};

// ========================== COMPONENT CHÍNH ========================== //
export const SearchResultArticle: FC = () => {
  return (
    <Suspense fallback={<SearchresultArticleFallback />}>
      <SearchresultArticleContent />
    </Suspense>
  );
};
