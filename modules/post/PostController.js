import { sendErrorResponse, sendResponse } from "../../util/Functions.js";
import { ValidationError } from "../../util/types/Error.js";
import { ResponseData } from "../../util/types/ResponseData.js";
import { ResponseMessage } from "../../util/types/ResponseMessage.js";
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

  creaetePost = async (req, res) => {
    try {
      const createdId = req.user?.index;
      const post = req.body;
      console.log("게시물 생성 컨트롤러 데이터", createdId, post);

      const missingFields = [];
      if (!post.title) missingFields.push("title");
      if (!post.content) missingFields.push("content");
      if (!createdId) missingFields.push("createdId");
      if (missingFields.length > 0) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: missingFields.join(",") + "필드가 누락되었습니다.",
        });
      }
      const createdPost = await this.postService.createPost({
        post,
        createdId,
      });
      const response = ResponseData.data(createdPost);

      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

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
        return sendErrorResponse(
          res,
          new Error(`${postId}를 찾을 수 없습니다.`)
        );
      }
      sendResponse(res, post);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
