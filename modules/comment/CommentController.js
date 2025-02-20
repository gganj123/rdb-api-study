import { sendErrorResponse, sendResponse } from "../../util/Functions.js";
import { ValidationError } from "../../util/types/Error.js";
import { ResponseData } from "../../util/types/ResponseData.js";
import { ResponseMessage } from "../../util/types/ResponseMessage.js";
import { CommentService } from "./CommentService.js";
import { response } from "express";

export class CommentController {
  /**
   * 댓글 컨트롤러
   *
   * @param {InstanceType<typeof CommentService} CommentService
   */

  constructor() {
    this.commentService = new CommentService();
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */

  createComment = async (req, res) => {
    try {
      const { content, postId } = req.body;
      const userId = req.user?.index;

      console.log("댓글 생성 컨트롤러 데이터", content, postId, userId);

      const missingFields = [];
      if (!content) missingFields.push("content");
      if (!postId) missingFields.push("postId");
      if (!userId) missingFields.push("userId");
      if (missingFields.length > 0) {
        throw new ValidationError({
          message: ResponseMessage.badRequest,
          customMessage: missingFields.join(",") + "필드가 누락되었습니다.",
        });
      }
      const createdComment = await this.commentService.createComment({
        content,
        postId,
        userId,
      });

      const response = ResponseData.data({ createdComment });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findAllComment = async (req, res) => {
    try {
      const comments = await this.commentService.findAllComments();
      console.log("조회된 댓글 목록:", comments); // 데이터 확인

      const response = ResponseData.data({ comments });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findCommentByUserId = async (req, res) => {
    try {
      const userId = req.user?.index;
      console.log("컨트롤러 유저아이디값", userId);
      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }
      const comments = await this.commentService.findCommentByUserId(userId);

      if (!comments) {
        return sendErrorResponse(
          res,
          new Error("해당 유저의 게시물들이 없습니다.")
        );
      }

      const response = ResponseData.data({ comments });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findCommentByPostId = async (req, res) => {
    try {
      const postId = req.params.postId;
      console.log("컨트롤러 포스트아이디값", postId);
      const comments = await this.commentService.findCommentByPostId(postId);

      if (!comments) {
        return sendErrorResponse(
          res,
          new Error("해당 게시글의 댓글이 없습니다.")
        );
      }

      const response = ResponseData.data({ comments });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findCommentByCommentId = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      console.log("컨트롤러 포스트아이디값", commentId);
      const comment = await this.commentService.findCommentByCommentId(
        commentId
      );

      if (!comment) {
        return sendErrorResponse(res, new Error("해당 댓글이 없습니다."));
      }

      const response = ResponseData.data({ comment });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  updateComment = async (req, res) => {
    try {
      const userId = req.user?.index;
      const commentId = req.params.commentId;
      const content = req.body.content;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      if (!commentId || !content) {
        return sendErrorResponse(
          res,
          new Error("내용과 commentId를 모두 입력해주세요.")
        );
      }

      const updateCount = await this.commentService.updateCommnet({
        userId,
        commentId,
        content,
      });
      console.log("updateCountComment", updateCount);

      if (updateCount > 0) {
        const response = ResponseData.data({
          commentId,
          userId,
          content,
          message: "댓글이 수정되었습니다.",
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

  deleteComment = async (req, res) => {
    try {
      const userId = req.user?.index;
      const commentId = req.params.commentId;

      if (!userId || isNaN(Number(userId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const deleteComment = await this.commentService.deleteComment({
        userId,
        commentId,
      });

      if (deleteComment > 0) {
        const response = ResponseData.data({
          commentId,
          userId,
          meessage: "댓글이 삭제되었습니다.",
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
