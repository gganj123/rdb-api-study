import { Router } from "express";
import { PostController } from "../modules/post/PostController";

/**
 * 포스트 라우터
 *
 * @export
 * @param {Router} app
 */

export function postRoutes(app) {
  const router = Router();
  const postController = new PostController();

  router.get("/", postController.findAllPosts);
  router.get("/:postId", postController.findPostById);

  app.use("/posts", router);
}
