import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { Page, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";

import { Article } from "types/article";
import { convertDay } from "components/format/day";
import { urlImageArticle } from "api";


const { Title } = Text;

interface NewsProps {
  layout: "cover" | "list-item";
  article: Article;
  before?: React.ReactNode;
  after?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const NewsItem: FunctionComponent<NewsProps> = ({
  layout,
  article,
  onClick,
}) => {
  const navigate = useNavigate();

  const viewDetail = () => {
    navigate("/article", { state: { data: article.id } });
  };

  if (layout === "cover") {
    //const date = new Date(article.published_at);
    //const time = convertDay(date);
    return (
      <Page
        restoreScrollOnBack
        onClick={onClick ?? viewDetail}
        className="relative overflow-hidden p-0 restaurant-with-cover"
      >
        {article.imageUrl != null ? (
          <div className="aspect-cinema relative h-44  ">
            <img
              src={`${urlImageArticle}${article.imageUrl}`}
              className="absolute w-full h-full "
            />
          </div>
        ) : (
          <div className="mb-2"></div>
        )}
        <Title size="normal" className="line-clamp-2">
          {article?.titleCut}
        </Title>
        <div className="">
          <span className="italic text-base">
            {`Ngày đăng: ${article.createdDate}`}
          </span>
        </div>
      </Page>
    );
  }

  return null;
};

export default NewsItem;
