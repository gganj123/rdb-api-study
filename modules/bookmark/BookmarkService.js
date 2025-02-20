import { createTransactionalService } from "../../database/TransactionProxy.js";
import { BookmarkMapper } from "./BookmarkMapper.js";
import { BookmarkInfo } from "./models/BookmarkInfo.js";

class _BookmarkService {
  /** @type {BookmarkMapper} */
  BookmarkMapper;

  constructor() {
    this.bookmarkMapper = new BookmarkMapper();
  }

  /**
   * 모든 북마크 조회
   * @returns {Promise<BookmarkInfo[]>}
   */

  async findAllBookmarks() {
    const bookmarks = await this.bookmarkMapper.findAllBookmarks();
    console.log("북마크 전체 조회 결과:", bookmarks);

    return bookmarks;
  }

  /**
   * 북마크 추가 또는 삭제 (토글 기능)
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<{ message: string, isBookmarked: boolean }>}
   */
  async toggleBookmark({ postId, userId }) {
    const existingBookmark = await this.bookmarkMapper.findBookmark({
      postId,
      userId,
    });

    if (existingBookmark) {
      await this.bookmarkMapper.removeBookmark(existingBookmark.index);
      return { message: "북마크가 삭제되었습니다.", isBookmarked: false };
    } else {
      const result = await this.bookmarkMapper.addBookmark({ postId, userId });
      console.log("서비스 북마크 추가", result);
      return { message: "북마크가 추가되었습니다.", isBookmarked: true };
    }
  }

  /**
   * userId로 북마크 조회
   * @param {number} userId
   * @returns {Promise<BookmarkInfo[]}
   */

  async findBookmarkByUserId(userId) {
    const bookmarks = await this.bookmarkMapper.findBookmarkByUserId(userId);
    return bookmarks;
  }

  /**
   * 특정 게시글이 북마크되었는지 확인
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  async isBookmarked({ postId, userId }) {
    return await this.bookmarkMapper.isBookmarked({ postId, userId });
  }

  /**
   * 특정 게시글의 북마크 수 조회
   * @param {number} postId
   * @returns {Promise<number>}
   */
  async countBookmarksByPostId(postId) {
    return await this.bookmarkMapper.countBookmarksByPostId(postId);
  }

  /**
   * 게시글의 모든 북마크 삭제
   * @param {number} postId
   * @return {Promise<{message: string, deletedCount: number}>}
   */
  async deleteBookmarksByPostId(postId) {
    return await this.bookmarkMapper.deleteBookmarksByPostId(postId);
  }
}
/**
 * @type {typeof _BookmarkService}
 * @description 트랙잭션 프록시를 적용한 BookmarkService
 */

export const BookmarkService = createTransactionalService(_BookmarkService);
