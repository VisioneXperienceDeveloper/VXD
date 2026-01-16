export interface BlogComment {
  id: string;
  comment: string;
  post_id: string;
}

export type Comment = {
  id: string;
  comment: string;
  createdTime: string;
  postId: string;
};
