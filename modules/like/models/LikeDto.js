import dayjs from "dayjs";
import { ValidationError } from "../../../util/types/Error.js";
import { ResponseMessage } from "../../../util/types/ResponseMessage.js";

export class LikeCreateDto {
  /**@type {number} */
  postId;
  /**@type {number} */
  userId;

  constructor(like) {
    Object.kley(this).forEach((key) => {
      if (like[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
    });
  }
}

export class LikeDto {
  /**@type {number} */
  index;
  /** @type {number} */
  postId;
  /** @type {number} */
  createdId;
  /** @type {dayjs.Dayjs} */
  createdTime;

  constructor(like) {
    Object.keys(this).forEach((key) => {
      if (like[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
      this[key] = key.includes("Time") ? dayjs(like[key]) : like[key];
    });
  }
}
