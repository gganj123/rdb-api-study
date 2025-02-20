import { Router } from "express";
import { BookmarkController } from "../modules/bookmark/BookmarkController.js";
import { jwtAuth } from "../util/Middlewares.js";

/**
 * 북마크 라우터
 *
 * @export
 * @param {Router} app
 */

export function bookmarkRoutes(app) {
  const router = Router();
  const bookmarkController = new BookmarkController();

  router.get("/", bookmarkController.findAllBookmarks);
  router.get("/toggle/:postId", jwtAuth, bookmarkController.toggleBookmark);
  router.get("/userId", jwtAuth, bookmarkController.findBookmarkById);
  router.get("/status/:postId", jwtAuth, bookmarkController.isBookmarked);
  router.get("/count/:postId", bookmarkController.countBookmarksByPostId);
  router.delete("/postId/:postId", bookmarkController.deleteBookmarksByPostId);
  router.delete(
    "/userId/",
    jwtAuth,
    bookmarkController.deleteBookmarksByUserId
  );
  router.get("/top/:limit", bookmarkController.mostBookmarkedPosts);

  app.use("/bookmarks", router);
}
