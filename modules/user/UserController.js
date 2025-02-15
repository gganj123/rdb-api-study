import { response } from "express";
import { sendErrorResponse, sendResponse } from "../../util/Functions.js";
import { ValidationError } from "../../util/types/Error.js";
import { ResponseData } from "../../util/types/ResponseData.js";
import { ResponseMessage } from "../../util/types/ResponseMessage.js";
import { UserService } from "./UserService.js";
export class UserController {
  /**
   * 유저 컨트롤러
   *
   * @param {InstanceType<typeof UserService>} userService
   */

  userService;
  constructor() {
    this.userService = new UserService();
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  join = async (req, res) => {
    try {
      const user = req.body;
      // 필수 필드 검사
      const missingFields = [];
      if (!user.email) missingFields.push("email");
      if (!user.password) missingFields.push("password");
      if (!user.name) missingFields.push("name");
      if (missingFields.length > 0) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: missingFields.join(", ") + "필드가 누락되었습니다.",
        });
      }
      const createdUser = await this.userService.createUser(user);
      const response = ResponseData.data(createdUser);

      sendResponse(res, response);
    } catch (e) {
      sendErrorResponse(res, e);
    }
  };

  findAllUsers = async (req, res) => {
    try {
      const users = await this.userService.findAllUsers();
      const response = ResponseData.fromData(users);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
