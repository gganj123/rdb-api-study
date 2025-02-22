import { Router } from "express";
import { LikeController } from "../modules/like/LikeController.js";
import { jwtAuth } from "../util/Middlewares.js";

/**
 * 좋아요 라우터
 *
 * @export
 * @param {Router} app
 */

export function likeRoutes(app) {
  const router = Router();
  const likeController = new LikeController();

  router.get("/", likeController.findAllLike);
  router.get("/toggle/:postId", jwtAuth, likeController.toggleLike);
  router.get("/userId", jwtAuth, likeController.findLikeByUserId);
  router.get("/status/:postId", jwtAuth, likeController.isLiked);
  router.get("/count/:postId", likeController.countLikesByPostId);
  router.get("/top/:limit", likeController.mostLikedPosts);

  app.use("/likes", router);
}
