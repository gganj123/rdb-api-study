import dayjs from "dayjs";
import { ValidationError } from "../../../util/types/Error.js";
import { ResponseMessage } from "../../../util/types/ResponseMessage.js";

export class CommentCreateDto {
  /** @type {string} */
  content;
  /** @type {number} */
  postId;
  /** @type {number} */
  createdId;

  constructor(comment) {
    Object.keys(this).forEach((key) => {
      if (comment[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
    });
  }
}

export class CommentDto {
  /** @type {number} */
  index;
  /** @type {string} */
  content;
  /** @type {number} */
  postId;
  /** @type {number} */
  createdId;
  /** @type {dayjs.Dayjs} */
  createdTime;
  /** @type {dayjs.Dayjs} */
  updateTime;

  constructor(comment) {
    Object.keys(this).forEach((key) => {
      if (comment[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
      this[key] = key.includes("Time") ? dayjs(comment[key]) : comment[key];
    });
  }
}
