import { CreatedUpdateTimeId } from "../../../util/types/Common.js";

export class BookmarkInfo extends CreatedUpdateTimeId {
  /** @type {number} */
  index;

  /** @type {number}*/
  postId;

  /** @type {number} */
  createdId;
}
