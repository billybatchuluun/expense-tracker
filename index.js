const express = require("express");
const cors = require("cors");
const { sql } = require("./db");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/neon", async (req, res) => {
  const data = await sql`SELECT * FROM playing_with_neon`;

  res.send(data);
});

app.post("/signup", async (req, res) => {
  try {
    console.log(req.body.name);
    await sql`INSERT INTO users(name) VALUES (${req.body.name})`;
  } catch (error) {
    // throw res.send({ error: "Error arised when creating user" });
    console.error("error at signup");
  }

  res.status(201).send({ message: "Successfully created" });
});

app.listen(PORT, () => {
  console.log("Application running at http://localhost:" + PORT);
});
