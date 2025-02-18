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
   * 특정 아이디로 유저 찾기
   * @param {number} userId
   * @returns {Promise<UserMst>}
   */
  findById(userId) {
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("user_mst")
        .WHERE(`index = :userId`)
        .addParam("userId", userId)
        .findOne()
    );
  }

  /**
   * 특정 이메일로 유저 찾기 => README에 보면 id와 email 두가지를 넣고
   * 특정 조건을 만족하는 데이터를 찾는다 나오는데, 고유한 이메일만으로도 찾을 수 있는데
   * 혹시 ID도 같이 넣는것에 이유가 있는지 질문하기.
   *
   * @param {string} email
   * @returns {Promise<UserMst>}
   */
  findByEmail(email) {
    return this.exec(async (query) =>
      query
        .SELECT("*")
        .FROM("user_mst")
        .WHERE(`email = :email`)
        .addParam("email", email)
        .findOne()
    );
  }

  /**
   * 유저 정보 수정
   * @param {number} userId
   * @param {string} email
   * @param {string} name
   * @returns {Promise<number>}
   */
  updateUser(userId, email, name) {
    console.log("맵퍼 업데이트 파라미터", userId, email, name);
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(
          `UPDATE user_mst SET email = :email, name = :name WHERE index = :userId`
        )
        .addParam("email", email)
        .addParam("name", name)
        .addParam("userId", userId)
        .rawExec();

      // 수정 결과 디버깅 출력
      console.log("UPDATE 결과:", result);
      return result;
    });
  }

  /**
   * 회원 탈퇴
   * @param {number} userId
   * @returns {Promise<number>}
   */
  deleteUser(userId) {
    return this.exec(async (query) => {
      const result = await query
        .rawQuery(`DELETE FROM user_mst WHERE index = :userId`)
        .addParam("userId", userId)
        .rawExec();
      console.log("삭제 맵퍼 결과값", result);

      return result || 0;
    });
  }
  /**
   * 유저 존재 여부 확인
   * 회원탈퇴나 유저정보수정 시 존재여부 확인으로 확실한 에러메세지를 보낼 수 있다.
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  existUserById(userId) {
    return this.exec(async (query) => {
      console.log("exist:", userId);
      const result = await query
        .rawQuery(
          `SELECT EXISTS(SELECT 1 FROM user_mst WHERE index = :userId) AS "exists"`
        )
        .addParam("userId", userId)
        .rawFindOne();
      console.log("exist mapper result", result);
      return result;
    });
  }

  // changePassword(userId, hashPassword) {
  //   return this.exec(async (query) => {
  //     query.UPDATE("user_mst").SET({ password: hashPassword }).WHERE("index", "=", userId);
  //   });
  // }
}
