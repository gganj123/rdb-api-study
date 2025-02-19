import { CreatedUpdateTimeId } from "../../../util/types/Common.js";
export class CommentInfo extends CreatedUpdateTimeId {
  /** @type {number} */
  index;

  /** @type {string} */
  content;

  /** @type {number} */
  postId;

  /** @type {number} */
  createdId;
}
