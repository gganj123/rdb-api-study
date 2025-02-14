import dayjs from 'dayjs'
const { Dayjs } = dayjs

/** @typedef {'Y'|'N'} Yn */

/**
 * @abstract
 * @class CreatedUpdateTime
 */
export class CreatedUpdateTime {
  /** @type {Dayjs} */
  createdTime

  /** @type {Dayjs} */
  updateTime
}

/**
 * @abstract
 * @class CreatedUpdateId
 */
export class CreatedUpdateId {
  /** @type {string} */
  createId

  /** @type {string} */
  updateId
}

/**
 * @abstract
 * @class CreatedUpdateTimeId
 */
export class CreatedUpdateTimeId {
  /** @type {Dayjs} */
  createdTime

  /** @type {Dayjs} */
  updateTime

  /** @type {string} */
  createId

  /** @type {string} */
  updateId
}

export const Yn = Object.freeze({
  Y: 'Y',
  N: 'N'
})

export const Provider = Object.freeze({
  KAKAO: 'KAKAO',
  APPLE: 'APPLE',
  ID: 'ID'
})