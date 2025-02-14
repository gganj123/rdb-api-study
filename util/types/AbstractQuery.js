
/**
 * 파일 관련 쿼리 인터페이스
 * @typedef {Object} FileQuery
 * @property {string} fileType - 파일 타입
 * @property {number} [contentsNo] - 컨텐츠 번호 (선택사항)
 * @property {number} [userId] - 사용자 ID (선택사항)
 * @property {number} [limit] - 제한 수 (선택사항)
 * @property {string} [fieldName] - 필드명 (선택사항)
 */







/**
 * 카운트 쿼리 파라미터 인터페이스
 * @typedef {Object} CountQueryParams
 * @property {string} table - 테이블명
 * @property {string} [where] - WHERE 조건절 (선택사항)
 */

/**
 * 날짜 범위 인터페이스
 * @typedef {Object} FromToDate
 * @property {string} fromDate - 시작 날짜
 * @property {string} toDate - 종료 날짜
 */

/**
 * 키워드 인터페이스
 * @typedef {Object} KeywordParam
 * @property {string[]} keyword - 키워드
 */

/**
 * @description file count 쿼리 추가
 * @param {FileQuery} params
 * @returns {string}
 */
export function addFileCountQuery(params) {
  let query = `coalesce(`
  query += `( SELECT count(*) FROM common.attach_file_info`
  query += ` WHERE attach_file_type = ${params.fileType}`

  if (params.contentsNo) {
    query += ` AND contents_no = ${params.contentsNo}`
  }
  query += `), 0) AS file_cnt`

  return query
}

/**
 * @description 생성자로 파일 쿼리 추가
 * @param {FileQuery} params
 * @returns {string}
 */
export function addCreatorFileQuery(params) {
  let query = `coalesce((SELECT count(*) FROM common.attach_file_info WHERE attach_file_type = '${params.fileType}' AND created_id = ${params.userId} `

  if (params.limit) {
    query += ` LIMIT ${params.limit}`
  }

  query += `), 0) as file_cnt`
  query += ` ,'${params.fileType}' AS file_type`

  return query
}

/**
 * @description 파일 쿼리 추가
 * @param {FileQuery} params
 * @returns {string}
 */
export function addFileQuery(params) {
  let query = `(SELECT json_agg(sub_image) FROM (SELECT s.attach_file_no, s.origin_file_name, s.file_path, s.created_time` +
    `, s.update_time FROM common.attach_file_info s` +
    ` WHERE s.attach_file_type = '${params.fileType}'`

  if (params.userId) {
    query += ` AND s.created_id = ${params.userId}` // userId 조건 추가
  }

  if (params.contentsNo) {
    query += ` AND s.contents_no = ${params.contentsNo}` // contentsNo 조건 추가
  }

  query += `) sub_image ) AS ${params.fieldName}` // 쿼리 마무리

  return query
}

/**
 * @description 전체 카운트 쿼리 추가
 * @param {Object} params
 * @param {string} params.table - 테이�� 이름
 * @param {string} [params.where] - 조건절
 * @returns {string}
 */
export function addAllCountQuery({ table, where }) {
  let query = `(SELECT count(*) FROM ${table}`
  if (where) {
    query += ` WHERE ${where}`
  }
  query += `) AS all_cnt`

  return query
}

/**
 * @description 필터 결과 카운트 쿼리 추가
 * @param {Object} params
 * @param {string} params.table - 테이블 이름
 * @param {string} [params.where] - 조건절
 * @returns {string}
 */
export function addTotalCountQuery(params) {
  let query = `(SELECT count(*) FROM ${params.table}`
  if (params.where) {
    query += ` WHERE ${params.where}`
  }
  query += `) AS total_cnt`

  return query
}

/**
 * @description 행 번호 쿼리 추가
 * @param {string} sort - 정렬 조건
 * @returns {string}
 */
export function addRowNoQuery(sort) {
  return `row_number() over(${sort}) as no`
}

/**
 * @typedef {'INNER'|'LEFT'|'RIGHT'|'FULL'|'CROSS'|'NATURAL'|'FULL OUTER'|'LEFT OUTER'|'RIGHT OUTER'|'NATURAL OUTER'} JoinType
 */

/**
 * @typedef {'ASC'|'DESC'|'USING'|'NULLS FIRST'|'NULLS LAST'|'ASC NULLS FIRST'|'ASC NULLS LAST'|'DESC NULLS FIRST'|'DESC NULLS LAST'} OrderByDirection
 */

/**
 * @typedef {Object} Join
 * @property {JoinType} type - 조인 타입
 * @property {string} table - 조인할 테이블 이름
 * @property {string} on - 조인 조건
 */

/**
 * @typedef {Object} OrderBy
 * @property {string} field - 정렬 필드
 * @property {OrderByDirection} direction - 정렬 방향
 */

/**
 * @typedef {Object} Query
 * @property {string} name - 쿼리 이름
 * @property {'SELECT'|'UPDATE'|'DELETE'|'INSERT'|null} type - 쿼리 타입
 * @property {string} table - 테이블 이름
 * @property {string[]} selectFields - select할 필드들
 * @property {string[]} insertFields - insert할 필드들
 * @property {any[]} values - 쿼리에 사용될 값들
 * @property {Record<string,any>} params - 파라미터화된 값들
 * @property {Record<string,any>} updateSets - update할 필드와 값들
 * @property {boolean} returning - 반환 여부
 * @property {Join[]} joins - 조인 조건
 * @property {string[]} where - WHERE 조건절
 * @property {string[]} groupBy - GROUP BY 필드 목록
 * @property {string[]} having - HAVING 조건절
 * @property {OrderBy[]} orderBy - 정렬 조건
 * @property {string[]} returningFields - RETURNING 절에 포함될 필드들
 * @property {number|null} limit - LIMIT 값
 * @property {number|null} offset - OFFSET 값
 */

/**
 * 쿼리빌더 추상화 클래스
 *
 * @abstract
 * @export
 * @class AbstractQuery
 */
export class AbstractQuery {
  /** @type {string} @protected */
  name
  /** @type {Query} @protected */
  query
  /** @type {string} @protected */
  _rawQuery

  constructor() {
    this._rawQuery = ''
    this.query = {
      name: '',
      type: null,
      table: '',
      selectFields: [],
      insertFields: [],
      values: [],
      params: {},
      updateSets: {},
      returning: false,
      joins: [],
      where: [],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      offset: null,
      returningFields: []
    }
  }

  /**
   * 쿼리 이름 지정
   * @description 쿼리 이름을 지정합니다. 쿼리 이름은 쿼리를 실행할 때 로그에서 식별하기 위해 사용됩니다.
   * @param {string} name
   * @returns {this}
   */
  setName(name) {
    this.name = name
    this.query.name = name
    return this
  }

  /**
   * raw 쿼리 작성 
   * @description raw 쿼리를 작성합니다. 쿼리빌더로 작성하지 못할 복잡한 쿼리가 필요할때 사용합니다. `rawQuery()를` 사용하게 되면 `SET_PARAM()`과 `SET_PARAMS()` 메서드를 제외하고 다른 함수들을 사용하면 문법 에러가 발생하니 주의해주세요
   * @example
   * ```js
   * query.rawQuery('SELECT * FROM users')
   * ```
   * @param {string} query
   */
  rawQuery(query) {
    this._rawQuery += ' ' + query
    return this
  }

  /**
   * SELECT문 추가
   * @description SELECT문을 추가합니다. 실제 쿼리에서 `SELECT ~~` 부분을 작성할때 사용합니다. 그러기 때문에 데이터를 호출하는 쿼리를 작상할때, 제일 먼저 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * `*` 또는 필드명을 입력하면 됩니다. 만약 `FROM()`에서 테이블의 alias를 지정했다면, alias를 사용해야합니다.
   * @example
   * ```js
   * // case 1
   * query.SELECT('*').FROM('users')
   * // case 2
   * query.SELECT('id', 'name', 'email').FROM('users')
   * // case 3
   * query.SELECT('u.id', 'u.name', 'u.email').FROM('users u')
   * 
   * ```
   * @param {string[]} fields
   * @returns {this}
   */
  SELECT(...fields) {
    this.query.type = 'SELECT'
    this.query.selectFields = fields.length > 0 ? fields : ['*']
    return this
  }

  /**
   * INSERT 쿼리 시작
   * @description INSERT문을 추가합니다. 실제 쿼리에서 `INSERT INTO ~~` 부분을 작성할때 사용합니다. 그러기 때문에 데이터를 생성하는 쿼리를 작상할때, 제일 먼저 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * query.INSERT('users').INSERT_FIELDS('id', 'name', 'email').INSERT_VALUES('1', 'John Doe', 'john.doe@example.com')
   * ```
   * @param {string} table
   * @returns {this}
   */
  INSERT(table) {
    this.query.type = 'INSERT'
    this.query.table = table
    return this
  }

  /**
   * INSERT 필드 추가
   * @description INSERT문에서 필드를 추가합니다. 실제 쿼리에서 `INSERT INTO ~~` 부분을 작성할때 사용합니다. 그러기 때문에 `INSERT()` 메서드를 호출한 후, 반드시 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * 필드 이름은 반드시 DB에 있는 컬럼명을 사용해야합니다. 그렇지 않으면 존재하지 않는 컬럼이라는 에러가 발생합니다.
   * @example
   * ```js
   * query.INSERT('users').INSERT_FIELDS('id', 'name', 'email').INSERT_VALUES('1', 'John Doe', 'john.doe@example.com')
   * ```
   * @param {string[]} fields
   * @returns {this}
   */
  INSERT_FIELDS(...fields) {
    this.query.insertFields = fields
    return this
  }

  /**
   * INSERT 값 추가
   * @description INSERT문에서 값을 추가합니다. 실제 쿼리에서 `INSERT INTO ~~` 부분을 작성할때 사용합니다. 그러기 때문에 `INSERT_FIELDS()` 메서드를 호출한 후, 반드시 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다. 단일 데이터를 넣을때는 `INSERT_FIELDS()`에 입력한 데이터 이름 순서대로 넣으면 되고, 여러개의 데이터를 넣을때는 순서에 맞춰 배열로 넣으면 됩니다.
   * @example
   * ```js
   * // case 1
   * query.INSERT('users').INSERT_FIELDS('id', 'name', 'email').INSERT_VALUES('1', 'John Doe', 'john.doe@example.com')
   * // case 2
   * query.INSERT('users').INSERT_FIELDS('id', 'name', 'email').INSERT_VALUES(['1', 'John Doe', 'john.doe@example.com'], ['2', 'Jane Doe', 'jane.doe@example.com'])
   * ```
   * @param {string[] | string[][]} values
   * @returns {this}
   */
  INSERT_VALUES(...values) {
    this.query.values = values
    return this
  }

  /**
   * UPDATE 쿼리 시작
   * @description UPDATE문을 추가합니다. 실제 쿼리에서 `UPDATE ~~` 부분을 작성할때 사용합니다. 그러기 때문에 데이터를 수정하는 쿼리를 작상할때, 제일 먼저 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * query.UPDATE('users')
   * ```
   * @param {string} table
   * @returns {this}
   */
  UPDATE(table) {
    this.query.type = 'UPDATE'
    this.query.table = table
    return this
  }

  /**
   * UPDATE 필드 추가
   * @description UPDATE문에서 필드를 추가합니다. 실제 쿼리에서 `UPDATE ~~` 부분을 작성할때 사용합니다. 그러기 때문에 `UPDATE()` 메서드를 호출한 후, 반드시 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * 필드 이름은 camel case, snake case 모두 사용 가능합니다. 하지만 실제 DB에 있는 컬럼명과 맞아야 합니다.
   * @example
   * ```js
   * query.UPDATE('users').UPDATE_FIELDS({ name: 'John Doe', email: 'john.doe@example.com' }).WHERE('id = 1')
   * ```
   * @param {Record<string, any>} sets
   * @returns {this}
   */
  UPDATE_FIELDS(sets) {
    this.query.updateSets = sets
    return this
  }

  /**
   * DELETE 쿼리 시작
   * @description DELETE문을 추가합니다. 실제 쿼리에서 `DELETE FROM ~~` 부분을 작성할때 사용합니다. 그러기 때문에 데이터를 삭제하는 쿼리를 작상할때, 제일 먼저 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * query.DELETE('users')
   * ```
   * @param {string} table
   * @returns {this}
   */
  DELETE(table) {
    this.query.type = 'DELETE'
    this.query.table = table
    return this
  }

  /**
   * FROM 쿼리 시작
   * @description FROM문을 추가합니다. 실제 쿼리에서 `FROM ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `SELECT()` 또는 `UPDATE()` 또는 `DELETE()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * query.SELECT('*').FROM('users')
   * ```
   * @param {string} table
   * @returns {this}
   */
  FROM(table) {
    this.query.table = table
    return this
  }

  /**
   * JOIN 조인 추가
   * @description JOIN문을 추가합니다. 실제 쿼리에서 `JOIN ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `FROM()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * // case 1
   * query.SELECT('*').FROM('users').JOIN({ type: 'INNER', table: 'posts', on: 'users.id = posts.user_id' })
   * // case 2
   * query.SELECT('u.*', 'p.title').FROM('users u').JOIN({ type: 'LEFT', table: 'posts p', on: 'u.id = p.user_id' })
   * ```
   * @param {Join} params
   * @returns {this}
   */
  JOIN(params) {
    this.query.joins.push(params)
    return this
  }

  /**
   * WHERE 조건절 추가
   * @description WHERE문을 추가합니다. 실제 쿼리에서 `WHERE ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `FROM()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * 조건이 여러개 일때는 한번에 작성하거나 `AND()` 또는 `OR()` 메서드를 호출해야합니다.
   * @example
   * ```js
   * // case 1
   * query.SELECT('*').FROM('users').WHERE('id = 1')
   * // case 2
   * query.SELECT('*').FROM('users').WHERE('id = 1 AND name = "John Doe"')
   * // case 3
   * query.SELECT('*').FROM('users').WHERE('id = 1').AND('name = "John Doe"')
   * ```
   * @param {string} predicate
   * @returns {this}
   */
  WHERE(predicate) {
    this.query.where = [predicate]
    return this
  }

  /**
   * AND 조건절 추가
   * @description WHERE문에서 AND 조건을 추가합니다. 실제 쿼리에서 `WHERE ~~ AND ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `WHERE()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * // case 1
   * query.SELECT('*').FROM('users').WHERE('id = 1').AND('name = "John Doe"')
   * // case 2
   * query.SELECT('*').FROM('users').WHERE('id = 1').AND('name = "John Doe"').AND('email = "john.doe@example.com"')
   * ```
   * @param {string} predicate
   * @returns {this}
   */
  AND(predicate) {
    this.query.where.push('AND ' + predicate)
    return this
  }

  /**
   * OR 조건절 추가
   * @description WHERE문에서 OR 조건을 추가합니다. 실제 쿼리에서 `WHERE ~~ OR ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `WHERE()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * // case 1
   * query.SELECT('*').FROM('users').WHERE('id = 1').OR('name = "John Doe"')
   * // case 2
   * query.SELECT('*').FROM('users').WHERE('id = 1').OR('name = "John Doe"').OR('email = "john.doe@example.com"')
   * // case 3
   * query.SELECT('*').FROM('users').WHERE('id = 1').AND('name = "John Doe"').OR('email = "john.doe@example.com"')
   * ```
   * @param {string} predicate
   * @returns {this}
   */
  OR(predicate) {
    this.query.where.push('OR ' + predicate)
    return this
  }

  /**
   * GROUP BY 필드 추가
   * @description GROUP BY문을 추가합니다. 실제 쿼리에서 `GROUP BY ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `FROM()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * query.SELECT('*').FROM('users').GROUP_BY('id')
   * ```
   * @param {string[]} fields
   * @returns {this}
   */
  GROUP_BY(fields) {
    this.query.groupBy = fields
    return this
  }

  /**
   * HAVING 조건절 추가
   * @description HAVING문을 추가합니다. 실제 쿼리에서 `HAVING ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `GROUP_BY()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * query.SELECT('*').FROM('users').GROUP_BY('id').HAVING('COUNT(id) > 1')
   * ```
   * @param {string} predicate
   * @returns {this}
   */
  HAVING(predicate) {
    this.query.having = [predicate]
    return this
  }

  /**
   * ORDER BY 정렬 조건 추가
   * @description ORDER BY문을 추가합니다. 실제 쿼리에서 `ORDER BY ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `FROM()` 메서드를 호출한 후,  호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * query.SELECT('*').FROM('users').ORDER_BY('id')
   * ```
   * @param {OrderBy} params
   * @returns {this}
   */
  ORDER_BY(params) {
    this.query.orderBy.push(params)
    return this
  }

  /**
   * LIMIT 제한 추가
   * @description LIMIT문을 추가합니다. 실제 쿼리에서 `LIMIT ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `FROM()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * query.SELECT('*').FROM('users').LIMIT(10)
   * ```
   * @param {number} limit
   * @returns {this}
   */
  LIMIT(limit) {
    this.query.limit = limit
    return this
  }

  /**
   * OFFSET 추가
   * @description OFFSET문을 추가합니다. 실제 쿼리에서 `OFFSET ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `FROM()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * @example
   * ```js
   * query.SELECT('*').FROM('users').LIMIT(10).OFFSET(10)
   * ```
   * @param {number} offset
   * @returns {this}
   */
  OFFSET(offset) {
    this.query.offset = offset
    return this
  }

  /**
   * RETURNING 필드 추가
   * @description RETURNING문을 추가합니다. 실제 쿼리에서 `RETURNING ~~` 부분을 작성할때 사용합니다. 그러기 때문에 반드시 `FROM()` 메서드를 호출한 후, 호출해야합니다. 그렇지 않으면 문법 에러가 발생합니다.
   * 필드 이름은 snake case, 즉 DB에 있는 컬럼명을 사용해야합니다.
   * 모든 필드를 반환하고 싶다면 `*`를 사용하면 됩니다.
   * @example
   * ```js
   * // case 1  
   * query.INSERT('users').INSERT_FIELDS('id', 'name', 'email').INSERT_VALUES('1', 'John Doe', 'john.doe@example.com').RETURNING('*')
   * // case 2
   * query.INSERT('users').INSERT_FIELDS('id', 'name', 'email').INSERT_VALUES('1', 'John Doe', 'john.doe@example.com').RETURNING('id', 'name', 'email')
   * ```
   * @param {string[]} fields
   * @returns {this}
   */
  RETURNING(...fields) {
    this.query.returning = true
    if (fields.length === 0) {
      this.query.returningFields = ['*']
    } else {
      this.query.returningFields = fields
    }
    return this
  }

  /**
   * 파라미터 추가
   * @description 파라미터를 추가합니다. 쿼리를 작성할때 `:`를 사용해서 데이터를 바인딩할 수 있습니다. 예를 들어 `SELECT * FROM users WHERE id = :id` 와 같은 쿼리를 작성할 수 있습니다.
   * 파라미터 이름은 반드시 `:`를 뒤에 오는 단어와 일치해야합니다.
   * @example
   * ```js
   * query.SELECT('*').FROM('users').WHERE('id = :id').SET_PARAMS({ id: 1 })
   * 
   * // case 2
   * query.SELECT('*').FROM('users').WHERE('id = :id AND name = :name').SET_PARAMS({ id: 1, name: 'John Doe' })
   * ```
   * @param {Record<string, any>} params
   * @returns {this}
   */
  SET_PARAMS(params) {
    this.query.params = params
    return this
  }

  /**
   * 파라미터 추가
   * @description 파라미터를 추가합니다. 쿼리를 작성할때 `:`를 사용해서 데이터를 바인딩할 수 있습니다. 예를 들어 `SELECT * FROM users WHERE id = :id` 와 같은 쿼리를 작성할 수 있습니다.
   * 여러개의 파라미터가 아닌 하나의 파라미터를 바인딩하거나 업데이트 할때 사용합니다.
   * @example
   * ```js
   * query.SELECT('*').FROM('users').WHERE('id = :id').SET_PARAM('id', 1)
   * ```
   * @param {string} key 파라미터 이름
   * @param {any} value 파라미터 값
   * @returns {this}
   */
  SET_PARAM(key, value) {
    this.query.params[key] = value
    return this
  }


  /** 쿼리빌더 빌드
   * @abstract
   * @description 쿼리빌더를 빌드합니다. 쿼리빌더를 빌드하면 쿼리문을 생성합니다. 이 메소드는 자동으로 호출되기 때문에 직접 호출할 필요가 없습니다.
   * @protected
   * @returns {any}
   */
  build() { }

  /**
   * raw 쿼리 빌드
   * @description raw 쿼리를 빌드합니다. 쿼리빌더로 작성하지 못할 복잡한 쿼리가 필요할때 사용합니다. `rawQuery()` 메서드를 사용하게 되면 해당 메서드가 호출됩니다. 자동으로 호출되기 때문에 직접 호출할 필요가 없습니다.
   * @abstract
   * @protected
   * @returns {any}
   */
  rawQueryBuild() { }

  /**
   * 여러 개 조회
   * @abstract
   * @description 여러 개의 데이터를 조회합니다. 쿼리빌더를 사용하여 쿼리를 작성하고, 리스트로 데이터를 반환합니다.
   * @example
   * ```ts
   * const users: User[] = await query.SELECT('*').FROM('users').findMany()
   * ```
   * @returns {any}
   */
  findMany() { }

  /**
   * 하나 조회
   * @abstract
   * @description 하나의 데이터를 조회합니다. 쿼리빌더를 사용하여 쿼리를 작성하고, 객체로 데이터를 반환합니다.
   * @example
   * ```ts
   * const user: User = await query.SELECT('*').FROM('users').findOne()
   * ```
   * @returns {any}
   */
  findOne() { }

  /**
   * 쿼리 실행
   * @abstract
   * @description 쿼리를 실행합니다. 쿼리빌더를 사용하여 쿼리를 작성하고 호출만 할 때 사용합니다. 반환값은 없습니다.
   * @example
   * ```ts
   * await query.UPDATE('users').UPDATE_FIELDS({ name: 'John Doe' }).WHERE('id = 1').exec()
   * ```
   * @returns {void}
   */
  exec() { }

  /**
   * raw 쿼리 여러 개 조회
   * @abstract
   * @description raw 쿼리를 사용하여 여러 개의 데이터를 조회합니다. 쿼리빌더로 작성하지 못할 복잡한 쿼리가 필요할때 사용합니다. `rawQuery()` 메서드를 사용하게 되면 해당 메서드가 호출됩니다. 자동으로 호출되기 때문에 직접 호출할 필요가 없습니다.
   * @example
   * ```ts
   * const users: User[] = await query.rawQuery('SELECT * FROM users').rawFindMany()
   * ```
   * @returns {any}
   */
  rawFindMany() { }

  /**
   * raw 쿼리 하나 조회
   * @abstract
   * @description raw 쿼리를 사용하여 하나의 데이터를 조회합니다. 쿼리빌더로 작성하지 못할 복잡한 쿼리가 필요할때 사용합니다. `rawQuery()` 메서드를 사용하게 되면 해당 메서드를 호출해야합니다.
   * @example
   * ```ts
   * const user: User = await query.rawQuery('SELECT * FROM users').rawFindOne()
   * ```
   * @returns {any}
   */
  rawFindOne() { }

  /**
   * raw 쿼리 실행
   * @abstract
   * @description raw 쿼리를 실행합니다. 쿼리빌더로 작성하지 못할 복잡한 쿼리가 필요할때 사용합니다. `rawQuery()` 메서드를 사용하게 되면 해당 메서드를 호출해야합니다.
   * @example
   * ```ts
   * await query.rawQuery('UPDATE users SET name = "John Doe" WHERE id = 1').rawExec()
   * ```
   * @returns {any}
   */
  rawExec() { }
}