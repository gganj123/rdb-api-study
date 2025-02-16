import bcrypt from "bcryptjs";
import { createTransactionalService } from "../../database/TransactionProxy.js";
import { UserCreateDto, UserDto } from "./models/UserDto.js";
import { UserMapper } from "./UserMapper.js";
import { UserMst } from "./models/UserMst";
class _UserService {
  /** @type {UserMapper} */
  userMapper;

  constructor() {
    this.userMapper = new UserMapper();
  }

  /**
   * 유저 가입
   *
   * @async
   * @param {UserCreateDto} user
   * @returns {Promise<UserDto>}
   */
  async createUser(user) {
    const salt = await bcrypt.genSalt(10);
    // 비밀번호 해싱
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;

    const createdUser = await this.userMapper.createUser(user);
    // 민감 데이터 삭제
    delete createdUser.password;

    return new UserDto(createdUser);
  }

  /**
   * 0. 모든 유저 조회
   * @returns {Promise<UserMst[]>}
   */
  async findAllUsers() {
    const users = await this.userMapper.findAllUsers();
    return users;
  }

  /**
   * 1. 특정 아이디로 유저 찾기
   * @param {Number} userId
   * @returns {Promise<UserMst>}
   */

  async findById(userId) {
    const user = await this.userMapper.findById(userId);
    return user;
  }

  /**
   * 2. 특정 이메일로 유저 찾기
   * @param {string} email
   * @returns {Promise<UserMst>}
   */

  async findByEmail(email) {
    const user = await this.userMapper.findByEmail(email);
    return user;
  }

  /**
   *3. 유저 정보 수정
   * @param {number} userId
   * @param {string} email
   * @param {string} name
   * @returns {Promise<number>}
   */
  async updateUser(userId, email, name) {
    if (!email.includes("@")) {
      throw new Error("유효하지 않은 이메일 형식입니다.");
    }
    const trimName = name.trim();

    const result = await this.userMapper.updateUser(userId, email, trimName);
    return result;
  }
  /**
   *4. 회원 탈퇴
   * @param {number} userId
   * @returns {Promise<number>}
   */
  async deleteUser(userId) {
    const deletedUser = await this.userMapper.deleteUser(userId);
    return deletedUser;
  }
  /**
   *5. 유저 존재 여부
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  async existUserById(userId) {
    const result = await this.userMapper.existUserById(userId);
    return result;
  }
}
/**
 *  @type {typeof _UserService}
 *  @description 트랜잭션 프록시를 적용한 UserService
 */
export const UserService = createTransactionalService(_UserService);
