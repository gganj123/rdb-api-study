import { Router } from "express";
import { UserController } from "../modules/user/UserController.js";
import { jwtAuth, localAuth } from "../util/Middlewares.js";

/**
 * 유저 라우터
 *
 * @export
 * @param {Router} app
 */
export function userRoutes(app) {
  const router = Router();
  const userController = new UserController();

  router.post("/join", userController.join);
  router.get("/users", userController.findAllUsers);
  router.get("/users/Id", jwtAuth, userController.findById);
  router.get("/users/email", userController.findByEmail);
  router.post("/users/update", jwtAuth, userController.updateUser);
  router.delete("/users", jwtAuth, userController.deleteUser);
  router.get("/users/exist", jwtAuth, userController.existUserById);
  router.post("/users/login", localAuth);

  app.use("/users", router);
}
