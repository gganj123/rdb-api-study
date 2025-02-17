import { sendErrorResponse, sendResponse } from "../../util/Functions.js";
import { ResponseData } from "../../util/types/ResponseData.js";
import { PostService } from "./PostService.js";
import { response } from "express";

export class PostController {
  /**
   * 게시물 컨트롤러
   *
   * @param {InstanceType<typeof PostService>} postService
   */

  constructor() {
    this.postService = new PostService();
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */

  findAllPosts = async (req, res) => {
    try {
      const posts = await this.postService.findAllPosts();
      const response = ResponseData.data(posts);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findPostById = async (req, res) => {
    try {
      const { postId } = req.params;
      if (!postId || isNaN(Number(postId))) {
        return sendErrorResponse(res, new Error("postId를 확인해주세요."));
      }
      const post = await this.postService.findPostById(postId);

      if (!post) {
        return sendErrorResponse(res, new Error(`${postId}를 찾을 수 없습니다.`));
      }
      sendResponse(res, post);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
