import { createTransactionalService } from "../../database/TransactionProxy.js";
import { LikeMapper } from "./LikeMapper.js";

class _LikeService {
  /**@type {LikeMapper} */
  likeMapper;

  constructor() {
    this.likeMapper = new LikeMapper();
  }

  /**
   * 모든 좋아요 조회
   * @returns {Promise<LikeInfo[]>}
   */

  async findAllLike() {
    const likes = await this.likeMapper.findAllLikes();
    return likes;
  }

  /**
   * 좋아요 토글
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<{ message: string, isliked: boolean }>}
   */

  async toggleLike({ postId, userId }) {
    const existingLike = await this.likeMapper.findLike({
      postId,
      userId,
    });

    if (existingLike) {
      await this.likeMapper.deleteLike(existingLike.index);
      return { message: "좋아요가 삭제되었습니다.", isLiked: false };
    } else {
      await this.likeMapper.addLike({ postId, userId });
      return { message: "좋아요가 추가되었습니다.", isLiked: true };
    }
  }

  /**
   * userId로 좋아요한 게시물 조회
   * @param {number} userId
   * @returns {Promise<likeInfo[]}
   */

  async findLikesByUserId(userId) {
    const likes = await this.likeMapper.findLikesByUserId(userId);
    return likes;
  }

  /**
   * 특정 게시글의 좋아요 상태 확인
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */

  async isLiked({ postId, userId }) {
    const isLiked = await this.likeMapper.isLiked({ postId, userId });
    return isLiked;
  }

  async countLikesByPostId(postId) {
    const likeCount = await this.likeMapper.countLikesByPostId(postId);
    return likeCount;
  }

  /** 좋아요가 많은 게시글 순
   *@param {number} limit
   */

  async mostLikedPosts(limit) {
    const posts = await this.likeMapper.mostLikedPosts(limit);
    return posts;
  }
}

/**
 * @type {typeof _LikeService}
 * @description 트랙잭션 프록시를 적용한 LikemarkService
 */

export const LikeService = createTransactionalService(_LikeService);
