import { BaseMapper } from "../../util/types/BaseMapper.js";

export class FollowMapper extends BaseMapper {
  /**
   * 특정 사용자를 팔로우하고 있는지 확인
   * @param {number} followerId - 팔로우 하는 사용자 ID
   * @param {number} followingId - 팔로우 당하는 사용자 ID
   * @returns {Promise<{ index: number } | null>}
   */
  findFollow({ followerId, followingId }) {
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `SELECT index FROM follow_info WHERE follower_id = :followerId AND following_id = :followingId`
        )
        .addParam("followerId", followerId)
        .addParam("followingId", followingId)
        .rawFindOne();

      return result;
    });
  }

  /**
   * 특정 사용자를 팔로우
   * @param {number} followerId
   * @param {number} followingId
   * @returns {Promise<void>}
   */
  addFollow({ followerId, followingId }) {
    const result = this.exec(async (query) =>
      query
        .setName("Create follow")
        .INSERT("follow_info")
        .INSERT_FIELDS("follower_id,following_id")
        .INSERT_VALUES(followerId, followingId)
        .RETURNING("*")
        .exec()
    );
    if (!result) {
      throw new Error("팔로우에 실패했습니다.");
    }
    return result;
  }

  /** 팔로우 삭제
   * @param {number} followId
   * @returns {Promise<void>}
   */

  deleteFollow(followId) {
    const result = this.exec(async (query) =>
      query
        .DELETE()
        .FROM("follow_info")
        .WHERE(`index = :followId`)
        .addParam("followId", followId)
        .exec()
    );

    if (!result) {
      throw new Error("언팔로우에 실패했습니다.");
    }
    return result;
  }

  /**
   * 특정 사용자를 팔로우하는 사람들 조회 (팔로워 조회)
   * @param {number} followingId - 팔로우 당하는 사용자 ID
   * @returns {Promise<{ followerId: number, followerName: string }[]>}
   */

  findFollowers(followingId) {
    console.log("맵퍼 팔로워 조회 ID: ", followingId);

    return this.exec(async (query) =>
      query
        .rawQuery(
          `SELECT 
            f.follower_id AS followerId, 
            u.name AS followerName
         FROM follow_info AS f
         JOIN user_mst AS u ON f.follower_id = u.index
         WHERE f.following_id = :followingId`
        )
        .addParam("followingId", followingId)
        .rawFindMany()
    );
  }

  /**
   * 특정 사용자가 팔로우하고 있는 목록 조회 (팔로잉 조회)
   * @param {number} followerId - 팔로우 하는 사용자 ID
   * @returns {Promise<{ followingId: number, followingName: string }[]>}
   */
  findFollowing(followerId) {
    console.log("맵퍼 팔로잉 조회 ID: ", followerId);

    return this.exec(async (query) =>
      query
        .rawQuery(
          `SELECT 
            f.following_id AS followingId, 
            u.name AS followingName
         FROM follow_info AS f
         JOIN user_mst AS u ON f.following_id = u.index
         WHERE f.follower_id = :followerId`
        )
        .addParam("followerId", followerId)
        .rawFindMany()
    );
  }

  /**특정 사용자 팔로우 여부 조회
   * @param {number} followerId
   * @param {number} followingId
   * @returns {Promise<boolean>}
   */
  async isFollowed({ followerId, followingId }) {
    const result = await this.exec(async (query) =>
      query
        .rawQuery(
          `SELECT index FROM follow_info 
          WHERE follower_id = :followerId 
          AND following_id = :followingId`
        )
        .addParam("followerId", followerId)
        .addParam("followingId", followingId)
        .rawFindOne()
    );
    return !!result;
  }

  /** 팔로워 수 조회
   * @param {number} followingId
   * @returns {Promise<number>}
   */

  async countFollowers(followingId) {
    return this.exec(async (query) =>
      query
        .rawQuery(
          `SELECT COUNT(*) AS follwers_count 
        FROM follow_info 
        WHERE following_id = :followingId`
        )
        .addParam("followingId", followingId)
        .rawFindOne()
    );
  }

  /** 많은 팔로우 유저 순
   * @param {number} limit
   * @returns {Promise<{followingId: number, followersCount: number}>[]}
   */

  countMostFollowedUser(limit) {
    return this.exec(async (query) =>
      query
        .rawQuery(
          `SELECT following_id, COUNT(*) AS followers_count 
            FROM follow_info 
            GROUP BY following_id 
            ORDER BY followers_count DESC 
            LIMIT :limit`
        )
        .addParam("limit", limit)
        .rawFindMany()
    );
  }

  /** 많은 팔로잉 유저 순
   * @param {number} limit
   * @returns {Promise<{follower_id : number, following_count: number}>[]}
   */

  countMostFollowingUser(limit) {
    return this.exec(async (query) =>
      query
        .rawQuery(
          `SELECT follower_id, COUNT(*) AS following_count 
        FROM follow_info 
        GROUP BY follower_id 
        ORDER BY following_count DESC
        LIMIT :limit`
        )
        .addParam("limit", limit)
        .rawFindMany()
    );
  }

  /** 특정 팔로우 삭제
   * @param {number} follower_id
   * @param {number} following_id
   * @returns {Promise<{message: string}>}
   */

  adminDeleteFollow({ followerId, followingId }) {
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `DELETE FROM follow_info 
           WHERE following_id = :followingId 
           AND follower_id = :followerId`
        )
        .addParam("followingId", followingId)
        .addParam("followerId", followerId)
        .rawExec();

      return {
        message:
          result > 0
            ? "팔로우 관계가 삭제되었습니다."
            : "삭제할 팔로우 관계가 없습니다.",
      };
    });
  }
}
