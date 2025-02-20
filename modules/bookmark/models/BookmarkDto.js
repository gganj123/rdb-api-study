import dayjs from "dayjs";
import { ValidationError } from "../../../util/types/Error.js";
import { ResponseMessage } from "../../../util/types/ResponseMessage.js";

export class BookmarkCreateDto {
  /**@type {number} */
  postId;
  /**@type {number} */
  userId;

  constructor(bookmark) {
    Object.keys(this).forEach((key) => {
      if (bookmark[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
    });
  }
}

export class BookmarkDto {
  /** @type {number} */
  index;
  /** @type {number} */
  postId;
  /** @type {number} */
  createdId;
  /** @type {dayjs.Dayjs} */
  createdTime;

  constructor(bookmark) {
    Object.keys(this).forEach((key) => {
      if (bookmark[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
      this[key] = key.includes("Time") ? dayjs(bookmark[key]) : bookmark[key];
    });
  }
}
