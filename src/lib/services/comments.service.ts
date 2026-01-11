import { notion } from "../notion";

export const getCommentsDataSourceId = () => {
  const dataSourceId = process.env.NOTION_COMMENTS_DATA_SOURCE_ID;
  if (!dataSourceId) {
      throw new Error("NOTION_COMMENTS_DATA_SOURCE_ID is not set in environment variables");
  }
  return dataSourceId;
}
