import { BaseMapper } from "../../util/types/BaseMapper.js";
import { UserCreateDto } from "./models/UserDto.js";
import { UserMst } from "./models/UserMst.js";
export class UserMapper extends BaseMapper {
  /**
   * 모든 유저 조회
   * @returns {Promise<UserMst[]>}
   */
  findAllUsers() {
    return this.exec(async (query) => query.SELECT("*").FROM("user_mst").findMany());
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
    return this.exec(async (query) => query.SELECT("*").FROM("user_mst").WHERE("index", "=", userId).findOne());
  }

  /**
   * 2. 특정 이메일로 유저 찾기 => README에 보면 id와 email 두가지를 넣고
   * 특정 조건을 만족하는 데이터를 찾는다 나오는데, 고유한 이메일만으로도 찾을 수 있는데
   * 혹시 ID도 같이 넣는것에 이유가 있는지 질문하기.
   *
   * @param {string} email
   * @returns {Promise<UserMst>}
   */
  findByEmail(email) {
    return this.exec(async (query) => query.SELECT("*").FROM("user_mst").WHERE("email", "=", email).findOne());
  }
  /**
   *3. 유저 정보 수정
   * @param {number} userId
   * @param {string} email
   * @param {string} name
   * @returns {Promise<number>}
   */
  updateUser(userId, email, name) {
    return this.exec(async (query) =>
      query.UPDATE("user_mst").SET({ email: email, name: name }).WHERE("index", "=", userId)
    );
  }
  /**
   *4. 회원 탈퇴
   * @param {number} userId
   * @returns {Promise<number>}
   */
  deleteUser(userId) {
    return this.exec(async (query) => query.DELETE().FROM("user_mst").WHERE("index", "=", userId));
  }
}
