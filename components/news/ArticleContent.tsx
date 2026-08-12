import { RichText } from "@payloadcms/richtext-lexical/react";

import type { NewsItem } from "@/lib/news-api";

interface ArticleContentProps {
  content: NewsItem["content"];
}

/**
 * Render nội dung Lexical của bài viết.
 * Typography nằm ở class `.rich-text` trong `app/globals.css`.
 */
const ArticleContent = ({ content }: ArticleContentProps) => (
  <RichText data={content} className="rich-text" disableContainer />
);

export default ArticleContent;
