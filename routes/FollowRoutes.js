import { Router } from "express";
import { FollowController } from "../modules/follow/FollowController.js";
import { jwtAuth } from "../util/Middlewares.js";

/** 팔로우 라우터
 *
 * @export
 * @param {Router} app
 */

export function followRouter(app) {
  const router = Router();
  const followController = new FollowController();

  router.get("/:followingId", jwtAuth, followController.followToggle);
  router.get("/followers/:followingId", followController.findFollowers);
  router.get("/following/:followerId", followController.findFollowing);
  router.get("/status/:followingId", jwtAuth, followController.isFollowed);
  router.get("/countfollowers/:followingId", followController.countFollowers);
  router.get("/countfollowing/:followerId", followController.countFollowing);
  router.get("/mostfollowers/:limit", followController.countMostFollowedUser);
  router.get("/mostfollowing/:limit", followController.countMostFollowingUser);
  router.delete(
    "/:followerId/:followingId",
    followController.adminDeleteFollow
  );

  app.use("/follows", router);
}
