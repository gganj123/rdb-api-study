import { CreatedUpdateTimeId } from "../../../util/types/Common";

export class FollowInfo extends CreatedUpdateTimeId {
  /**@type {number} */
  index;

  /**@type {number} 팔로우 하는 사람 */
  followId;

  /**@type {number} 팔로우 받는 사람 */
  followingId;
}
