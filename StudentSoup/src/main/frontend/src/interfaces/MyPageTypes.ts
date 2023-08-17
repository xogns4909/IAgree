// 게시글 프리뷰
interface Board {
  boardId: number;
  title: string;
  writeDate: string;
  likedCount: number;
  viewCount: number;
}

export interface PreViewBoardResponse {
  content: Board[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 댓글 프리뷰
interface Reply {
  boardId: number;
  content: string;
  likedCount: number;
  writeDate: string;
}

export interface PreViewReplyResponse {
  content: Reply[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 리뷰 프리뷰
interface Review {
  restaurantReviewId: number;
  content: string;
  starLiked: number;
  likedCount: number;
  writeDate: string;
  imageName: string;
  restaurantId: number;
}

export interface PreviewReviewResponse {
  content: Review[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 게시글/댓글 작성 수
export interface DetailCountResponse {
  boardReplyWriteCount: number;
  boardWriteCount: number;
}
