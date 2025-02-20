export class followCreateDto {
  /**@type {number} */
  followId;
  /**@type {number} */
  followingId;

  constructor(follow) {
    Object.keys(this).forEach((key) => {
      if (follow[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
    });
  }
}

export class FollowDto {
  /** @type {number} */
  index;
  /** @type {number} */
  followId;
  /** @type {number} */
  followingId;
  /** @type {dayjs.Dayjs} */
  createdTime;

  constructor(Follow) {
    Object.keys(this).forEach((key) => {
      if (Follow[key] === undefined) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: `Missing required field: ${key}`,
        });
      }
      this[key] = key.includes("Time") ? dayjs(Follow[key]) : Follow[key];
    });
  }
}
