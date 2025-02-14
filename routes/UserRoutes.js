import { Router } from 'express'
import { UserController } from '../modules/user/UserController.js'



/**
 * 유저 라우터
 *
 * @export
 * @param {Router} app 
 */
export function userRoutes(app) {
  const router = Router()
  const userController = new UserController()

  router.post('/join', userController.join)

  app.use('/users', router)
}