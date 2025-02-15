import { BaseMapper } from "../../util/types/BaseMapper.js";
import { UserCreateDto } from "./models/UserDto.js";
import { UserMst } from "./models/UserMst.js";
export class UserMapper extends BaseMapper {
  /**
   * 모든 유저 조회
   * @returns {Promise<UserMst[]>}
   */
  findAllUsers() {
    return this.exec(async (query) =>
      query.SELECT("*").FROM("user_mst").findMany()
    );
  }

  /**
   * 유저 생성
   * @param {UserCreateDto} user
   * @returns {Promise<UserMst>}
   */
  createUser(user) {
    return this.exec(async (query) =>
      query
        .setName("Create User")
        .INSERT("public.user_mst")
        .INSERT_FIELDS("email, password, name")
        .INSERT_VALUES(user.email, user.password, user.name)
        .RETURNING("*")
        .exec()
    );
  }

  /**
   * 1. 특정 아이디로 유저 찾기
   * @param {number} userId
   * @returns {Promise<UserMst>}
   */
  findById(userId) {
    return this.exec(async (query) =>
      query.SELECT("*").FROM("user_mst").WHERE("index", "=", userId).findOne()
    );
  }

  /**
   * 2. 특정 아이디와 이메일로 유저 찾기
   * @param {number} userId
   * @param {string} email
   * @returns {Promise<UserMst>}
   */
  findByIdAndEmail(userId, email) {
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("user_mst")
        .WHERE("index", "=", userId)
        .OR("email", "=", email)
        .findOne()
    );
  }
}
