import { createTransactionalService } from "../../database/TransactionProxy.js";
import { FollowMapper } from "./FollowMapper.js";

class _FollowService {
  /** @type {FollowMapper} */
  followMapper;

  constructor() {
    this.followMapper = new FollowMapper();
  }

  /** 팔로우 토글
   * @param {number} followerId
   * @param {number} followingId
   * @returns {Promise<{ message: string, isliked: boolean }>}
   */

  async followToggle({ followerId, followingId }) {
    const existing = await this.followMapper.findFollow({
      followerId,
      followingId,
    });

    if (existing) {
      await this.followMapper.deleteFollow(existing.index);
      return { message: "언팔로우 했습니다.", isFollowed: false };
    } else {
      await this.followMapper.addFollow({ followerId, followingId });
      return { message: "팔로우 했습니다.", isFollowed: true };
    }
  }

  /**
   * 특정 사용자를 팔로우하는 사람들 조회 (팔로워 조회)
   * @param {number} followingId - 팔로우 당하는 사용자 ID
   * @returns {Promise<{ followerId: number, followerName: string }[]>}
   */

  async findFollowers(followingId) {
    const followers = await this.followMapper.findFollowers(followingId);
    return followers;
  }

  /**
   * 특정 사용자가 팔로우하고 있는 목록 조회 (팔로잉 조회)
   * @param {number} followerId - 팔로우 하는 사용자 ID
   * @returns {Promise<{ followingId: number, followingName: string }[]>}
   */

  async findFollowing(followerId) {
    const following = await this.followMapper.findFollowing(followerId);
    return following;
  }

  /**특정 사용자 팔로우 여부 조회
   * @param {number} followerId
   * @param {number} followingId
   * @returns {Promise<boolean>}
   */

  async isFollowed({ followerId, followingId }) {
    const isFollowed = await this.followMapper.isFollowed({
      followerId,
      followingId,
    });
    return isFollowed;
  }
}

/**
 * @type {typeof _FollowService}
 * @description 트랙잭션 프록시를 적용한 FollowService
 */

export const FollowService = createTransactionalService(_FollowService);
