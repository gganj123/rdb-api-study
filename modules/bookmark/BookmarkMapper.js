import { query } from "express";
import { BaseMapper } from "../../util/types/BaseMapper.js";
import { BookmarkCreateDto } from "./models/BookmarkDto.js";

export class BookmarkMapper extends BaseMapper {
  /**
   * 모든 북마크 조회
   * @returns {Promise<BookmarkInfo[]>}
   */
  findAllBookmarks() {
    return this.exec(async (query) =>
      query.rawQuery("SELECT * FROM bookmark_info").rawFindMany()
    );
  }

  /**
   * 특정 게시글의 북마크 여부 확인
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<{ index: number } | null>}
   */
  findBookmark({ postId, userId }) {
    console.log("토글 맵퍼", postId, userId);
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `SELECT * FROM bookmark_info WHERE post_id = :postId AND created_id = :userId`
        )
        .addParam("postId", postId)
        .addParam("userId", userId)
        .rawFindOne();
      return result;
    });
  }

  /**
   * 북마크 추가
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<void>}
   */
  addBookmark({ postId, userId }) {
    const result = this.exec(async (query) =>
      query
        .setName("Create Bookmark")
        .INSERT("bookmark_info")
        .INSERT_FIELDS("created_id, post_id")
        .INSERT_VALUES(userId, postId)
        .RETURNING("*")
        .exec()
    );
    if (!result) {
      throw new Error("북마크 추가에 실패했습니다.");
    }
    return result;
  }

  /**
   * 북마크 삭제
   * @param {number} bookmarkId
   * @returns {Promise<void>}
   */
  deleteBookmark(bookmarkId) {
    const result = this.exec(async (query) =>
      query
        .DELETE()
        .FROM("bookmark_info")
        .WHERE(`index = :bookmarkId`)
        .addParam("bookmarkId", bookmarkId)
        .exec()
    );
    if (!result) {
      throw new Error("북마크 삭제에 실패했습니다.");
    }
    return result;
  }

  /**
   * userId로 북마크한 게시물 조회
   * @param {number} userId
   * @returns {Promise<BookmarkInfo[]}
   */

  findBookmarkByUserId(userId) {
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("bookmark_info")
        .WHERE(`created_id = :userId`)
        .addParam("userId", userId)
        .findMany()
    );
  }

  /**
   * 특정 게시글의 북마크 상태 확인
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  isBookmarked({ postId, userId }) {
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `SELECT index FROM bookmark_info WHERE post_id = :postId AND created_id = :userId`
        )
        .addParam("postId", postId)
        .addParam("userId", userId)
        .rawFindOne();

      return !!result;
    });
  }

  /**
   * 특정 게시글의 북마크 수 조회
   * @param {number} postId
   * @returns {Promise<number>}
   */

  async countBookmarksByPostId(postId) {
    const result = await this.exec(async (query) =>
      query
        .SELECT("COUNT(*) as count")
        .FROM("bookmark_info")
        .WHERE("post_id = :postId")
        .addParam("postId", postId)
        .findOne()
    );
    console.log("카운트", result);
    return result?.count || 0;
  }

  /**
   * 게시글의 모든 북마크 삭제
   * @param {number} postId
   * @returns {Promise<{message: string, deletedCount: number}>}
   */

  async deleteBookmarksByPostId(postId) {
    const result = await this.exec(async (query) =>
      query
        .DELETE()
        .FROM("bookmark_info")
        .WHERE("post_id = :postId")
        .addParam("postId", postId)
        .RETURNING("*")
        .exec()
    );

    console.log(`삭제된 북마크 개수 ${result.length}`);

    return result.length > 0
      ? { message: "북마크가 삭제되었습니다.", deletedCount: result.length }
      : { message: "삭제할 북마크가 없습니다.", deletedCount: 0 };
  }

  /**유저의 모든 북마크 삭제
   *  유저의 모든 북마크 삭제
   * @param {number} userId
   * @returns {Promise<{message:string,deleteCount:number}}
   */

  async deleteBookmarksByUserId(userId) {
    const result = await this.exec(async (query) =>
      query
        .DELETE()
        .FROM(bookmark_info)
        .WHERE(`created_id = :userId`)
        .addParam("userId", userId)
        .RETURNING("*")
        .exec()
    );

    return result.length > 0
      ? { message: "북마크가 삭제되었습니다.", deletedCount: result.length }
      : { message: "삭제할 북마크가 없습니다.", deletedCount: 0 };
  }

  /** 북마크가 많은 게시글
   * @param {number} limit
   */
  async mostBookmarkedPosts(limit) {
    const result = await this.exec(async (query) =>
      query
        .SELECT(
          "p.index AS post_id",
          "p.title",
          "p.content",
          "COUNT(b.index) AS bookmark_count"
        )
        .FROM("post_info AS p")
        .LEFT_JOIN("bookmark_info AS b", "p.index = b.post_id")
        .GROUP_BY("p.index", "p.title", "p.content")
        .ORDER_BY("bookmark_count", "DESC")
        .LIMIT(limit)
        .findMany()
    );
    return result;
  }
}
