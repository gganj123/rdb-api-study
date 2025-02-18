import dayjs from "dayjs";
import { ValidationError } from "../../../util/types/Error.js";
import { ResponseMessage } from "../../../util/types/ResponseMessage.js";

export class PostCreateDto {
  /** @type {string} */
  title;
  /** @type {string} */
  content;
  /** @type {number} */
  createdId;

  constructor(post) {
    Object.keys(this).forEach((key) => {
      if (post[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
    });
  }
}

export class PostDto {
  /** @type {number} */
  index;
  /** @type {string} */
  title;
  /** @type {string} */
  content;
  /** @type {number} */
  createdId;
  /** @type {dayjs.Dayjs} */
  createdTime;
  /** @type {dayjs.Dayjs} */
  updateTime;

  constructor(post) {
    Object.keys(this).forEach((key) => {
      if (post[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
      this[key] = key.includes("Time") ? dayjs(post[key]) : post[key];
    });
  }
}
