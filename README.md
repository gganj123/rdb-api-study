# 여기닷 백엔드

## 설치

### npm 사용시

npm 을 사용하고 계신다면 `package.json` 파일에서 아래 코드를

```json
{
  "dependencies": {
    ...,
    "locale": "link:dayjs/plugin/locale",
    "timezone": "link:dayjs/plugin/timezone",
    "utc": "link:dayjs/plugin/utc",
    ...
  }
}
```

다음으로 변경

```json
{
  "dependencies": {
    ...,
    "locale": "file:dayjs/plugin/locale",
    "timezone": "file:dayjs/plugin/timezone",
    "utc": "file:dayjs/plugin/utc",
    ...
  }
}
```

이후 `npm install`을 실행해서 패키지들을 설치하시면 됩니다.

### pnpm 사용시

pnpm을 사용하고 계신다면 `pnpm install`을 실행해서 패키지들을 설치하시면 됩니다.

## 서버 실행방법

### npm 사용시

`npm run dev` 명령어를 실행하시면 됩니다.

### pnpm 사용시

`pnpm dev` 명령어를 실행하시면 됩니다.

## 데이터베이스 연결 설정

`DatabaseManager.js` 파일에서 데이터베이스 연결 설정을 할 수 있습니다.

```js
/// Pool 인스턴스 생성
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
  max: 100,
  min: 10,
});
```

각 파라미터에 들어갈 값은 다음과 같습니다.

- `user`: postgres
- `host`: 121.157.229.40
- `database`: assingment_db
- `password`: new123!@#
- `port`: 5432

## 쿼리 작성 방법

ORM을 사용하지 않고 Raw 쿼리를 사용하고 있기 때문에, 쿼리빌더를 자체적으로 구현하였습니다.
베이스는 `AbstractQuery`이며 각 디비별로 확장하여 사용합니다. 현재 회사는 PostgreSQL을 사용하고 있기 때문에 `PgQueryBuilder`를 구현하여 사용합니다.
`PgQueryBuilder`의 인스턴스를 생성해서 사용할 필요는 없습니다. 모든 Mapper 클래스 (DB와 직접적으로 통신하는 부분)은 `BaseMapper`를 상속받아 사용합니다.
`BaseMapper`에는 `exec` 메서드가 있습니다. 이 메서드는 `PgQueryBuilder` 인스턴스를 콜백으로 받아 쿼리를 실행합니다.

```js
class UserMapper extends BaseMapper {
  findAllUsers() {
    return this.exec(async (query) => query.SELECT("*").FROM("users").findMany());
  }
}
```

### `AbstractQuery` 클래스

`AbstractQuery` 클래스는 쿼리를 작성하는 베이스 클래스입니다. 쿼리를 작성할 때 사용하는 메서드들을 정의해두었습니다 (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, etc...)
각 함수의 사용법은 주석을 참고해주세요.

## `Mapper` 클래스

`Mapper` 클래스는 데이터베이스와 직접 통신하는 클래스입니다.
함수형 규칙은 다음과 같습니다.

1. `find` 함수는 데이터를 조회하는 함수입니다.
2. `create` 함수는 데이터를 생성하는 함수입니다.
3. `update` 함수는 데이터를 수정하는 함수입니다.
4. `delete` 함수는 데이터를 삭제하는 함수입니다.
5. `exists` 함수는 데이터가 존재하는지 확인하는 함수입니다.

그 다음으로 조건을 함수명에 추가합니다.

- `findAll` 함수는 모든 데이터를 조회합니다.
- `findById` 함수는 특정 아이디를 가진 데이터를 조회합니다.
- `findByIdAndEmail` 함수는 특정 조건을 만족하는 데이터를 조회합니다.
- `createUser` 함수는 유저를 생성합니다.
- `updateUser` 함수는 유저를 수정합니다.
- `deleteUser` 함수는 유저를 삭제합니다.
- `existsUserById` 함수는 유저가 존재하는지 확인합니다.

```js
class UserMapper extends BaseMapper {
  findAllUsers() {
    return this.exec(async (query) => query.SELECT("*").FROM("users").findMany());
  }
}
```

## `Service` 클래스

`Service` 클래스는 비즈니스 로직을 작성하는 클래스입니다.
`Mapper` 클래스와 같이 함수형 규칙을 따릅니다.
데이터를 가공하거나 조합하는 로직은 모두 `Service` 클래스에 작성합니다.

```js
class UserService {
  constructor() {
    this.userMapper = new UserMapper();
  }

  async findAllUsers() {
    return this.userMapper.findAllUsers();
  }

  async findUserById(id) {
    return this.userMapper.findById(id);
  }

  async createUser(user) {
    return this.userMapper.createUser(user);
  }
}
```

## `Controller` 클래스

`Controller` 클래스는 라우터와 같은 역할을 합니다.
`Service` 클래스를 사용하여 비즈니스 로직을 처리하고, 그 결과를 클라이언트에 반환합니다. `Controller` 클래스의 모든 메소드는 화살표함수로 작성해야합니다.
`Controller` 클래스에는 반드시 `try catch` 블록이 있어야합니다. 그리고 service에서 반환되는 값이 있으면 반드기 `ResponseData` 인스턴스로 만들어야하고, `sendResponse` 함수를 사용해야합니다.
에러가 발생하면 `sendErrorResponse` 함수를 사용해야합니다. `ResponseData` 참고해서 어떤 정적 메소드가 있는지 확인해주세요

```js
class UserController {
  constructor() {
    this.userService = new UserService();
  }

  findAllUsers = async (req, res) => {
    try {
      const users = await this.userService.findAllUsers();
      const response = ResponseData.fromData(users);
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
```

## router 작성 방법

미리 작성한 예제를 참고해서 만들어주세요.

## 예외 처리 방법

비즈니스 로직을 작성하다가 예외를 발생시켜야 할때가 있습니다. 예) 유저가 존재하지 않는 경우, 잘못된 파라미터가 들어온 경우 등등
이럴때는 `Error.js` 파일을 참고해서 적절한 예외를 발생시키면 됩니다.

```js
// 예시
throw new NotFoundError({ message: ResponseMessage.userNotFound, customMessage: "유저가 존재하지 않습니다." });
```

## 권장사항

- 모든 데이터베이스 쿼리는 `Mapper` 클래스에 작성합니다.
- 모든 비즈니스 로직은 `Service` 클래스에 작성합니다.
- 백엔드에서는 패키지 매니저로 `pnpm`을 사용하고 있습니다. 그래서 가능하면 `pnpm`을 설치해서 사용해주세요

## 서버 배포 방법

저희 회사는 FTP를 사용하여 서버에 배포합니다. 미리 FTP 클라이언트를 준비해주세요 (예: FileZilla)

- 프로토콜: SFTP
- Host: 121.157.229.40
- Port: 22
- User: heredot
- Password: new123!@#

접속하시면 `docker > assignment` 폴더가 있습니다. 그 안에 `app.js`, `utils`, `routes`, `modules` 폴더만 넣으시면 자동으로 서버가 재시작됩니다.

서버 URL은 다음과 같습니다.

- http://121.157.229.40:8506
