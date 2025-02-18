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
   * @param {number} postsId
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
}
