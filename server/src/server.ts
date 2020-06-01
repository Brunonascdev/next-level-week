import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.json([
    { id: "1", name: "Diego" },
    { id: "2", name: "Bruno" },
  ]);
});

app.listen(3333);
