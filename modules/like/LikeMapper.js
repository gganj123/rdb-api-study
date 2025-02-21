import { BaseMapper } from "../../util/types/BaseMapper.js";

export class LikeMapper extends BaseMapper {
  /**
   * 모든 좋아요 조회
   * @returns {Promise<LikeInfo[]>}
   */

  findAllLikes() {
    return this.exec(async (query) =>
      query.SELECT("*").FROM("like_info").findMany()
    );
  }

  /**
   * 특정 좋아요 여부 확인
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<{ index: number } | null>}
   */

  findLike({ postId, userId }) {
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `SELECT * FROM like_info WHERE post_id = :postId AND created_id = :userId`
        )
        .addParam("postId", postId)
        .addParam("userId", userId)
        .rawFindOne();

      return result;
    });
  }

  /**
   * 좋아요 추가
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<void>}
   */
  addLike({ postId, userId }) {
    const result = this.exec(async (query) =>
      query
        .setName("Create Like")
        .INSERT("like_info")
        .INSERT_FIELDS("created_id,post_id")
        .INSERT_VALUES(userId, postId)
        .RETURNING("*")
        .exec()
    );
    if (!result) {
      throw new Error("좋아요 추가에 실패했습니다.");
    }
    return result;
  }

  /**좋아요 삭제
   * @param {number} likeId
   * @returns {Promise<void>}
   */
  deleteLike(likeId) {
    const result = this.exec(async (query) =>
      query
        .DELETE()
        .FROM("like_info")
        .WHERE(`index = :likeId`)
        .addParam("likeId", likeId)
        .exec()
    );

    if (!result) {
      throw new Error("좋아요 삭제에 실패했습니다.");
    }
    return result;
  }

  /**
   * userId로 좋아요한 게시물 조회
   * @param {number} userId
   * @returns {Promise<likeInfo[]}
   */

  findLikesByUserId(userId) {
    console.log("맵퍼", userId);
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("like_info")
        .WHERE("created_id = :userId")
        .addParam("userId", userId)
        .findMany()
    );
  }

  /**
   * 특정 게시글의 좋아요 상태 확인
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */

  isLiked({ postId, userId }) {
    console.log("맵퍼", postId, userId);
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `SELECT index FROM like_info WHERE post_id = :postId AND created_id = :userId`
        )
        .addParam("postId", postId)
        .addParam("userId", userId)
        .rawFindOne();

      return !!result;
    });
  }

  /** 특정 게시글의 좋아요 수 조회
   * @param {number} postId가
   * @returns {Promise<number}
   */

  async countLikesByPostId(postId) {
    const result = await this.exec(async (query) =>
      query
        .SELECT("COUNT(*) as count")
        .FROM("like_info")
        .WHERE("post_id = :postId")
        .addParam("postId", postId)
        .findOne()
    );
    return result?.count || 0;
  }

  /** 좋아요가 많은 게시글 순
   * @param {number} limit
   */
  async mostLikedPosts(limit) {
    const result = await this.exec(async (query) =>
      query
        .rawQuery(
          `SELECT 
            p.index AS post_id, 
            p.title, 
            p.content, 
            COUNT(l.index) AS like_count
         FROM post_info AS p
         LEFT JOIN like_info AS l ON p.index = l.post_id
         GROUP BY p.index, p.title, p.content
         ORDER BY like_count DESC
         LIMIT :limit`
        )
        .addParam("limit", limit)
        .rawFindMany()
    );
    return result;
  }
}
