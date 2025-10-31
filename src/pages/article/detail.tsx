import React, { useEffect, useState } from "react";
import { Box, Header, Page, Text } from "zmp-ui";
import { useLocation } from "react-router-dom";
import { Article } from "types/article";
import { BASE_API, getArticleById, urlImageArticle, imageDefaut } from "api";
import "../../css/custom.css";

const { Title } = Text;

function ArticleDetail() {
  const location = useLocation();
  const id = location.state?.data; // Lấy id từ location.state
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const convertImageSrcAndStyle = (html: string) => {
    if (!html) return "";
    return html.replace(/<img\s+src="(\/[^"]+)"/g, '<img src="https://bacninh.gov.vn$1" style="width:100%; height:250px;"');
  };

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const response = await fetch(`${BASE_API}/${getArticleById}/${id}`);
        const json = await response.json();

        if (json?.data) {
          setArticle(json.data); // Gán trực tiếp object
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Error loading article detail:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Page className="min-h-0">
        <Header title="Chi tiết tin tức" />
        <Text className="m-2">Đang tải...</Text>
      </Page>
    );
  }

  if (!article) {
    return (
      <Page className="min-h-0">
        <Header title="Chi tiết tin tức" />
        <Text className="m-2">Không có dữ liệu</Text>
      </Page>
    );
  }

  return (
    <Page className="min-h-0">
      <Header title="Chi tiết tin tức" />

      <Box>
        <div className="aspect-cinema relative h-44">
          <img
            src={article.imageUrl ? `${urlImageArticle}${article.imageUrl}` : imageDefaut}
            className="absolute w-full h-full rounded-md"
          />
          <div className="text-justify text-white bg-teal-700 bg-opacity-50 absolute top-0 w-full h-full">
            <Title className="m-2 mt-5 text-xl">{article.titleCut}</Title>
            <Text className="text-right italic m-2 mt-5">{article.createdDate}</Text>
          </div>
        </div>
      </Box>

      <Box>
        {article.summary && (
          <div
            className="body-convert m-2 mb-5 font-semibold text-lg"
            dangerouslySetInnerHTML={{ __html: article.summary }}
          />
        )}
        {article.content && (
            <div
              className="body-convert m-2"
              dangerouslySetInnerHTML={{ __html: convertImageSrcAndStyle(article.content) }}
            />
          )}
      </Box>
    </Page>
  );
}

export default ArticleDetail;
