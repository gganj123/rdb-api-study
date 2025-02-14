import bcrypt from 'bcryptjs'
import { createTransactionalService } from '../../database/TransactionProxy.js'
import { UserCreateDto, UserDto } from './models/UserDto.js'
import { UserMapper } from './UserMapper.js'
class _UserService {

  /** @type {UserMapper} */
  userMapper

  constructor() {
    this.userMapper = new UserMapper()
  }

  /**
   * 유저 가입
   *
   * @async
   * @param {UserCreateDto} user
   * @returns {Promise<UserDto>}
   */
  async createUser(user) {
    const salt = await bcrypt.genSalt(10)
    // 비밀번호 해싱
    const hashPassword = await bcrypt.hash(user.password, salt)
    user.password = hashPassword

    const createdUser = await this.userMapper.createUser(user)
    // 민감 데이터 삭제
    delete createdUser.password

    return new UserDto(createdUser)
  }

}



/**
 *  @type {typeof _UserService} 
 *  @description 트랜잭션 프록시를 적용한 UserService
*/
export const UserService = createTransactionalService(_UserService)