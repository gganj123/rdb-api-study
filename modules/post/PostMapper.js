import { BaseMapper } from "../../util/types/BaseMapper.js";

export class PostMapper extends BaseMapper {
  /**
   * 모든 게시물 조회
   * @returns {Promise<PostInfo[]}
   */
  findAllPosts() {
    return this.exec(async (query) => query.SELECT("*").FROM("posts").findMany());
  }

  /**
   * 특정 Id로 게시물 조회
   * @param {number} postsId
   * @returns {Promise<PostInfo}
   */

  findPostById(postId) {
    return this.exec(async (query) => query.SELECT("*").FROM("posts").WHERE("index", "=", postId).findOne());
  }
}
