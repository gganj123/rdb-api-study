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

  findPostByPostId = async (req, res) => {
    try {
      const postId = req.params.postId;
      console.log("컨트롤러 포스트ID", postId);

      const post = await this.postService.findPostByPostId(postId);

      if (!post) {
        return sendErrorResponse(
          res,
          new Error("해당 postId의 게시물이 없습니다.")
        );
      }

      const response = ResponseData.data(post);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findPostByUserId = async (req, res) => {
    try {
      const userId = req.user?.index;
      console.log("컨트롤러 유저아이디값", userId);
      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const posts = await this.postService.findPostByUserId(userId);

      if (!posts) {
        return sendErrorResponse(
          res,
          new Error("해당 유저의 게시물들이 없습니다.")
        );
      }

      const response = ResponseData.data(posts);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  updatePost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user?.index;
      const { title, content } = req.body;
      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }
      if (!title || !content) {
        return sendErrorResponse(
          res,
          new Error("제목과 내용을 모두 입력해주세요.")
        );
      }

      const updateCount = await this.postService.updatePost({
        postId,
        userId,
        title,
        content,
      });
      console.log("updateCountPost", updateCount);
      if (updateCount > 0) {
        const response = ResponseData.data({
          postId,
          userId,
          title,
          content,
          message: "게시글이 수정되었습니다.",
        });
        return sendResponse(res, response);
      } else {
        return sendErrorResponse(
          res,
          new Error("게시글 수정을 실패하였습니다.")
        );
      }
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  deletePost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user?.index;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const deletePost = await this.postService.deletePost({ postId, userId });
      console.log("컨트롤러 게시물 삭제 값", deletePost);

      if (deletePost > 0) {
        const response = ResponseData.data({
          postId,
          userId,
          meessage: "게시물이 삭제되었습니다.",
        });
        sendResponse(res, response);
      } else {
        sendErrorResponse(res, new Error("게시물삭제에 실패하였습니다."));
      }
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
