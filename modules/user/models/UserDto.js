import dayjs from 'dayjs'
import { ValidationError } from '../../../util/types/Error.js'
import { ResponseMessage } from '../../../util/types/ResponseMessage.js'

export class UserCreateDto {
  /** @type {string} */
  email
  /** @type {string} */
  password
  /** @type {string} */
  name

  constructor(user) {
    Object.keys(this).forEach(key => {
      if (user[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`
        })
      }
    })
  }
}

export class UserDto {
  /** @type {number} */
  index
  /** @type {string} */
  email
  /** @type {string} */
  name
  /** @type {dayjs.Dayjs} */
  createdTime
  /** @type {dayjs.Dayjs} */
  updateTime


  constructor(user) {
    Object.keys(this).forEach(key => {
      if (user[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`
        })
      }
      this[key] = key.includes('Time') ? dayjs(user[key]) : user[key]
    })
  }
}
