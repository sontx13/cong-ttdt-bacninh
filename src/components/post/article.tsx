import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { Page, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { Article } from "types/article";
import { urlImageArticle,imageDefaut } from "api";

const { Title } = Text;

interface ArticleProps {
  layout: "cover" | "list-item";
  article: Article;
  activeCate:number;
  before?: React.ReactNode;
  after?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ArticleItem: FunctionComponent<ArticleProps> = ({
  layout,
  article,
  activeCate,
  before,
  after,
  onClick,
}) => {
  const navigate = useNavigate();
 
  const viewDetail = () => {
    navigate("/article", { state: { data: article.id } });
  };

  if (layout === "cover") {

    return (
      <Page
        restoreScrollOnBack
        onClick={onClick ?? viewDetail}
        className="relative bg-gray-200 rounded-xl  p-0 restaurant-with-cover"
      >
        {article.imageUrl != null ? (
          <div className="aspect-cinema relative h-44  m-2 ">
            <img
              src={
                article.imageUrl
                  ? article.imageUrl.startsWith("http")
                    ? article.imageUrl
                    : `${urlImageArticle}${article.imageUrl}`
                  : imageDefaut
              }
              className="absolute w-full h-full rounded-md"
            />
          </div>
        ) : (
          <div className="mb-2"></div>
        )}
        <Title size="normal" className="ml-2 mr-0 overflow-x-auto line-clamp-2">
          {article?.titleCut}
        </Title>
        <div className="m-2">
          <span className="italic text-base line-clamp-2">
            {`Ngày đăng:  ${article.createdDate}`}
          </span>
        </div>
        
      </Page>
    );
  }

  return null;
};

export default ArticleItem;
