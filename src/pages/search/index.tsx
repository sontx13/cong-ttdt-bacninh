import React, { FC } from "react";
import { Header, Page } from "zmp-ui";
import { Inquiry } from "./inquiry";
import { SearchResultArticle } from "./result_article";

const SearchPage: FC = () => {
  return (
    <Page className="flex flex-col">
      <Header title="Tìm kiếm tin tức" />
      <Inquiry />
      {/* <SearchResult /> */}
      <SearchResultArticle/>
    </Page>
  );
};

export default SearchPage;
