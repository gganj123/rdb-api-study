import { CreatedUpdateTimeId } from '../../../util/types/Common.js'

export class PostInfo extends CreatedUpdateTimeId {
  /** @type {number} */
  index

  /** @type {string} */
  title

  /** @type {string} */
  content

  /** @type {number} */
  createdId
}

