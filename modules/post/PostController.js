import { sendErrorResponse, sendResponse } from "../../util/Functions";
import { ResponseData } from "../../util/types/ResponseData";
import { PostService } from "./PostService";
import { response } from "express";

export class PostController {
  /**
   * 게시물 컨트롤러
   *
   * @param {InstanceType<typeof PostService>} postService
   */

  postService;
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
      const posts = this.postService.findAllPosts();
      const response = ResponseData.fromData(posts);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
