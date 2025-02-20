import { CreatedUpdateTimeId } from "../../../util/types/Common.js";

export class LikeInfo extends CreatedUpdateTimeId {
  /** @type {number} */
  index;

  /** @type {number} */
  postId;

  /**@type {number} */
  createdId;
}
