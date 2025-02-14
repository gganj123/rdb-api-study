import { CreatedUpdateTimeId } from '../../../util/types/Common'
export class CommentInfo extends CreatedUpdateTimeId {
  /** @type {number} */
  index

  /** @type {string} */
  content

  /** @type {number} */
  postIndex

}