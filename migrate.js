// import pg from "pg";
// const { Client } = pg;

// const client = new Client({
//   user: "postgres",
//   host: "121.157.229.40",
//   database: "assignment_db",
//   password: "new123!@#",
//   port: 5432,
// });

// async function migrate() {
//   try {
//     await client.connect();
//     console.log("✅ PostgreSQL 연결 성공");

//     const query = `
//       ALTER TABLE comment_info ADD COLUMN post_id INTEGER REFERENCES post_info(id) ON DELETE CASCADE;
//     `;
//     await client.query(query);
//     console.log("✅ post_id 컬럼 추가 성공");
//   } catch (error) {
//     console.error("❌ 마이그레이션 오류:", error);
//   } finally {
//     await client.end();
//   }
// }

// migrate();
