import { CreatedUpdateTime } from '../../../util/types/Common.js'


export class UserMst extends CreatedUpdateTime {
  /** @type {number} */
  index

  /** @type {string} */
  email

  /** @type {string} */
  password
}