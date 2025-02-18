import { BaseMapper } from "../../util/types/BaseMapper.js";
import { PostCreateDto } from "./models/PostDto.js";

export class PostMapper extends BaseMapper {
  /**
   * 모든 게시물 조회
   * @returns {Promise<PostInfo[]}
   */
  findAllPosts() {
    return this.exec(async (query) =>
      query.SELECT("*").FROM("post_info").findMany()
    );
  }

  /**
   * 게시물 생성
   * @param {PostCreateDto} Post
   * @returns {Promise<PostInfo>}
   */

  createPost({ post, createdId }) {
    console.log("맵퍼 데이터값", post, createdId);
    return this.exec(async (query) => {
      const result = query
        .setName("Create Post")
        .INSERT("public.post_info")
        .INSERT_FIELDS("title,content,created_id")
        .INSERT_VALUES(post.title, post.content, createdId)
        .RETURNING("*")
        .exec();

      console.log("🟢 Post 생성 결과:", result);
      return result;
    });
  }

  /**
   * 특정 Id로 게시물 조회
   * @param {number} postId
   * @returns {Promise<PostInfo}
   */

  findPostByPostId(postId) {
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("post_info")
        .WHERE(`index = :postId`)
        .addParam("postId", postId)
        .findOne()
    );
  }

  /**
   * 특정 Id로 게시물 조회
   * @param {number} userId
   * @returns {Promise<PostInfo[]}
   */

  findPostByUserId(userId) {
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("post_info")
        .WHERE(`created_id = :userId`)
        .addParam("userId", userId)
        .findMany()
    );
  }

  /**
   * 게시글 수정
   * @param {number} postId
   * @param {number} userId
   * @param {string} title
   * @param {string} content
   * @returns {Promise<number>}
   */
  updatePost(postId, userId, title, content) {
    console.log("맵퍼 업데이트포스트 파라미터", postId, userId, title, content);
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `UPDATE post_info SET title = :title, content = :content WHERE index = :postId AND created_id = :userId`
        )
        .addParam("title", title)
        .addParam("content", content)
        .addParam("postId", postId)
        .addParam("userId", userId)
        .rawExec();

      // 수정 결과 디버깅 출력
      console.log("UPDATE post결과:", result);
      return result;
    });
  }

  /**
   * 게시글 삭제
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<number>}
   */
  deletePost(postId, userId) {
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `DELETE FROM post_info WHERE index = :postId AND created_id = :userId`
        )
        .addParam("postId", postId)
        .addParam("userId", userId)
        .rawExec();
      console.log("삭제 맵퍼post 결과값", result);

      return result || 0;
    });
  }
}
