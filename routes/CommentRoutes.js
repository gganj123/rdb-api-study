import { Router } from "express";
import { CommentController } from "../modules/comment/CommentController.js";
import { jwtAuth } from "../util/Middlewares.js";

/**
 * 댓글 라우터
 *
 * @export
 * @param {Router} app
 */

export function commentRoutes(app) {
  const router = Router();
  const commentController = new CommentController();

  router.post("/", jwtAuth, commentController.createComment);
  router.get("/", commentController.findAllComment);
  router.get("/userId", jwtAuth, commentController.findCommentByUserId);
  router.get("/postId/:postId", commentController.findCommentByPostId);
  router.get("/commentId/:commentId", commentController.findCommentByCommentId);
  router.post("/update/:commentId", jwtAuth, commentController.updateComment);
  router.delete("/delete/:commentId", jwtAuth, commentController.deleteComment);

  app.use("/comments", router);
}
