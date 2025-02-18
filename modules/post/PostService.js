import { createTransactionalService } from "../../database/TransactionProxy.js";
import { PostMapper } from "./PostMapper.js";
import { PostInfo } from "./models/PostInfo.js";
import { PostCreateDto, PostDto } from "./models/PostDto.js";

class _PostService {
  /**@type {PostMapper} */
  PostMapper;

  constructor() {
    this.postMapper = new PostMapper();
  }

  /**
   * 모든 게시물 조회
   * @returns {Promise<PostInfo[]>}
   */

  async findAllPosts() {
    const posts = await this.postMapper.findAllPosts();
    return posts;
  }

  async findPostById(postId) {
    const post = await this.postMapper.findPostById(postId);
    return post;
  }

  /**
   * 게시물 생성
   *
   * @async
   * @param {PostCreateDto} post
   * @returns {Promist<PostInfo>}
   */
  async createPost({ post, createdId }) {
    const createdPost = await this.postMapper.createPost({ post, createdId });
    return new PostDto(createdPost);
  }
}
/**
 *  @type {typeof _PostService}
 *  @description 트랜잭션 프록시를 적용한 PostService
 */
export const PostService = createTransactionalService(_PostService);
