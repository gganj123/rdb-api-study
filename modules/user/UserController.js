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
      const response = ResponseData.data(users);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findById = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId || isNaN(Number(userId))) {
        throw new ValidationError({ message: "userId를 확인해주세요" });
      }
      const user = await this.userService.findById(userId);
      if (!user) {
        return sendErrorResponse(res, new Error("해당 userId의 사용자가 없습니다."));
      }
      const response = ResponseData.data(user);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findByEmail = async (req, res) => {
    try {
      const { email } = req.query;
      if (!email || typeof email !== "string") {
        throw new ValidationError({ message: "email을 확인해주세요" });
      }
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return sendErrorResponse(res, new Error("해당 email의 사용자가 없습니다."));
      }
      const response = ResponseData.data(user);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  updateUser = async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { email, name } = req.body;
      if (!email | !name) {
        return sendErrorResponse(res, new Error("이름과 이메일을 모두 입력해주세요."));
      }

      const existUser = await this.userService.existUserById(userId);
      if (!existUser) {
        return sendErrorResponse(res, new Error("존재하지 않는 유저입니다."));
      }

      const updateCount = await this.userService.updateUser(userId, email, name);
      if (updateCount > 0) {
        const response = ResponseData.data({
          userId,
          email,
          name,
          message: "정보가 수정되었습니다.",
        });
        return sendResponse(res, response);
      } else {
        return sendErrorResponse(res, new Error("정보 수정을 실패하였습니다."));
      }
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  deleteUser = async (req, res) => {
    try {
      const userId = req.user?.userId;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      //유효성 검사 강화
      const existUser = await this.userService.existUserById(userId);
      if (!existUser) {
        return sendErrorResponse(res, new Error("존재하지 않는 유저입니다."));
      }

      const deletedUser = await this.userService.deleteUser(userId);

      if (deletedUser > 0) {
        const response = ResponseData.data({
          userId,
          message: "회원이 탈퇴되었습니다.",
        });
        sendResponse(res, response);
      } else {
        sendErrorResponse(res, new Error("탈퇴에 실패하였습니다."));
      }
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  existUserById = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }
      const existUser = await this.userService.existUserById(userId);
      sendResponse(res, existUser);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
