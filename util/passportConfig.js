import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { jwtStrategy } from "./Jwt.js";

// 예제 사용자 DB
const users = [
  {
    userId: "17",
    email: "user@example.com",
    password: bcrypt.hashSync("securePassword123!", 10),
  },
];
passport.use(jwtStrategy);
// localStrategy 정의 및 등록
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = users.find((u) => u.email === email);
        if (!user) return done(null, false, { message: "이메일이 존재하지 않습니다." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "비밀번호가 일치하지 않습니다." });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
