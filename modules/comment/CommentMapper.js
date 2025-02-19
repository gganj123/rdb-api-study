import { BaseMapper } from "../../util/types/BaseMapper.js";
import { CommentCreateDto } from "./models/CommentDto.js";
import { CommentInfo } from "./models/CommentInfo.js";

export class CommentMapper extends BaseMapper {
  /** 댓글 생성
   * @param {CommentCreateDto} Comment
   * @returns {Promise<CommentInfo>}
   */

  createComment({ postId, userId, content }) {
    console.log("맵퍼댓글 데이터값", postId, userId, content);
    return this.exec(async (query) => {
      const result = query
        .setName("Create Comment")
        .INSERT("public.comment_info")
        .INSERT_FIELDS("content, post_id, created_id")
        .INSERT_VALUES(content, postId, userId)
        .RETURNING("*")
        .exec();

      return result;
    });
  }

  /** 모든 댓글 조회
   * @return {Promise<CommentInfo[]>}
   */
  findAllComments() {
    return this.exec(async (query) =>
      query.SELECT("*").FROM("comment_info").findMany()
    );
  }

  /**
   * userId로 게시물 조회
   * @param {number} userId
   * @returns {Promise<CommentInfo[]}
   */

  findCommentByUserId(userId) {
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("comment_info")
        .WHERE(`created_id = :userId`)
        .addParam("userId", userId)
        .findMany()
    );
  }

  /**
   * postId로 게시물 조회
   * @param {number} postId
   * @returns {Promise<CommentInfo[]}
   */

  findCommentByPostId(postId) {
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("comment_info")
        .WHERE(`post_id = :postId`)
        .addParam("postId", postId)
        .findMany()
    );
  }

  /**
   * commentId로 게시물 조회
   * @param {number} commentId
   * @returns {Promise<CommentInfo[]}
   */

  findCommentByCommentId(commentId) {
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("comment_info")
        .WHERE(`index = :commentId`)
        .addParam("commentId", commentId)
        .findOne()
    );
  }

  /**
   * 댓글 수정
   * @param {number} commentId
   * @param {number} userId
   * @param {string} content
   * @returns {Promise<number>}
   */

  updateComment(userId, commentId, content) {
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `UPDATE comment_info SET content = :content WHERE created_Id = :userId AND index = :commentId`
        )
        .addParam("content", content)
        .addParam("userId", userId)
        .addParam("commentId", commentId)
        .rawExec();

      return result;
    });
  }
  /**
   * 댓글 삭제
   * @param {number} commentId
   * @param {number} userId
   * @returns {Promise<number>}
   */

  deleteComment(userId, commentId) {
    console.log("삭제맵퍼 데이터", userId, commentId);
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `DELETE FROM comment_info WHERE index = :commentId AND created_id = :userId`
        )
        .addParam("userId", userId)
        .addParam("commentId", commentId)
        .rawExec();
      return result || 0;
    });
  }
}
