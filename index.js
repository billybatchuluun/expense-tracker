const express = require("express");
const cors = require("cors");
const { sql } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// async function passwordHashTest(password) {
//   const result = await bcrypt.compare(password, hash);
//   console.log(result);
// }

// passwordHashTest("generic");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3003",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/neon", async (req, res) => {
  const data = await sql`SELECT * FROM playing_with_neon`;

  res.send(data);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    if (user && user.length > 0) {
      console.log("object");
      const hashedPassword = user[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (passwordMatch) {
        res.send("Successfully logged in");
      } else {
        res.status(401).send("Invalid Login");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users(email, name, password, avatar_Img, createdAt, updatedAt) VALUES (${email}, ${name}, ${encryptedPassword}, 'img', ${new Date()}, ${new Date()})`;
  } catch (error) {
    console.error(error);
  }

  res.status(201).send({ message: "Successfully created" });
});

app.listen(PORT, () => {
  console.log("Application running at http://localhost:" + PORT);
});
