import cors from "cors";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { config } from "dotenv";
import express, { Router } from "express";
import passport from "passport";
import { PgDBManager } from "./database/DatabaseManager.js";
import { userRoutes } from "./routes/UserRoutes.js";
import { postRoutes } from "./routes/PostRoutes.js";
import "./util/passportConfig.js";
import { commentRoutes } from "./routes/CommentRoutes.js";
// dotenv
config();

// timezone 설정
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const app = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// passport 설정
passport.initialize();

// api 라우터
const apiRouter = Router();

// 유저 라우터
userRoutes(apiRouter);
postRoutes(apiRouter);
commentRoutes(apiRouter);

app.use("/api", apiRouter);
app.use(passport.initialize());

// 서버 실행
app.listen(3000, () => {
  // DB 연결
  new PgDBManager().connect();
  console.log("Server is running on port 3000");
});
