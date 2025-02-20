import { sendErrorResponse, sendResponse } from "../../util/Functions.js";
import { ResponseData } from "../../util/types/ResponseData.js";
import { BookmarkService } from "./BookmarkService.js";
import { response } from "express";

export class BookmarkController {
  /**
   * 북마크 컨트롤러
   *
   * @param {InstanceType<typeof BookmarkService>} bookmarkService
   */

  constructor() {
    this.bookmarkService = new BookmarkService();
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */

  findAllBookmarks = async (req, res) => {
    try {
      const bookmarks = await this.bookmarkService.findAllBookmarks();
      const response = ResponseData.data({ bookmarks });
      console.log("컨트롤러 북마크 : ", response);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  toggleBookmark = async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user?.index;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const bookmark = await this.bookmarkService.toggleBookmark({
        postId,
        userId,
      });
      const response = ResponseData.data({ bookmark });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
  findBookmarkById = async (req, res) => {
    try {
      const userId = req.user?.index;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const bookmarks = await this.bookmarkService.findBookmarkByUserId(userId);
      console.log("컨트롤러", bookmarks);
      const response = ResponseData.data({ bookmarks });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  isBookmarked = async (req, res) => {
    try {
      const { postId } = req.params.postId;
      const userId = req.user?.index;

      if (!postId || !userId) {
        return sendErrorResponse(
          res,
          new Error("userId,postId를 확인해주세요.")
        );
      }

      const isBookmarked = await this.bookmarkService.isBookmarked({
        postId,
        userId,
      });

      const response = ResponseData.data({ isBookmarked });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  countBookmarksByPostId = async (req, res) => {
    try {
      const postId = req.params.postId;

      if (!postId) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: "postId가 필요합니다.",
        });
      }

      const count = await this.bookmarkService.countBookmarksByPostId(
        Number(postId)
      );
      const response = ResponseData.data({ bookmarkCount: count });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  deleteBookmarksByPostId = async (req, res) => {
    try {
      const postId = req.params.postId;

      const result = await this.bookmarkService.deleteBookmarksByPostId(postId);
      const response = ResponseData.data({ result });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  deleteBookmarksByUserId = async (req, res) => {
    try {
      const userId = req.user?.index;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const result = await this.bookmarkService.deleteBookmarksByUserId(userId);
      const response = ResponseData.data({ result });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  mostBookmarkedPosts = async (req, res) => {
    try {
      const limit = req.params.limit;
      const posts = await this.bookmarkService.mostBookmarkedPosts(limit);
      const response = ResponseData.data({ posts });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
