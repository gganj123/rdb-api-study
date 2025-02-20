import { sendErrorResponse, sendResponse } from "../../util/Functions.js";
import { ResponseData } from "../../util/types/ResponseData.js";
import { LikeService } from "./LikeService.js";
import { response } from "express";

export class LikeController {
  /**
   * 라이크 컨트롤러
   *
   * @param {InstanceType<typeof LikeService>} LikeService
   */

  constructor() {
    this.likeService = new LikeService();
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */

  findAllLike = async (req, res) => {
    try {
      const likes = LikeController.findAllLike();
      const response = ResponseData.data({ likes });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  toggleLike = async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user?.index;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const like = await this.likeService.toggleLike({ userId, postId });
      const response = ResponseData.data({ like });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findLikeByUserId = async (req, res) => {
    try {
      const userId = req.user?.index;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }
      const likes = await this.likeService.findLikesByUserId(userId);

      const response = ResponseData.data({ likes });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  isLiked = async (req, res) => {
    try {
      const userId = req.user?.index;
      const postId = req.params.postId;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const isLiked = await this.likeService.isLiked({ postId, userId });

      const response = ResponseData.data({ isLiked });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(req, error);
    }
  };

  countLikesByPostId = async (req, res) => {
    try {
      const postId = req.params.postId;
      const likeCount = await this.likeService.countLikesByPostId(postId);

      const response = ResponseData.data({ likeCount: likeCount });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  mostLikedPosts = async (req, res) => {
    try {
      const limit = req.params.limit;

      const posts = await this.likeService.mostLikedPosts(limit);
      const response = ResponseData.data({ posts });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
