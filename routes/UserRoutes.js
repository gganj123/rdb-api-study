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
  router.get("/", userController.findAllUsers);
  router.get("/Id", jwtAuth, userController.findById);
  router.get("/email", userController.findByEmail);
  router.post("/update", jwtAuth, userController.updateUser);
  router.delete("/", jwtAuth, userController.deleteUser);
  router.get("/exist", jwtAuth, userController.existUserById);
  router.post("/login", localAuth);

  app.use("/users", router);
}
