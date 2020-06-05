import express from "express";
import cors from "cors";
import path from "path";
import Routes from "./routes";
import { errors } from "celebrate";

const app = express();

app.use(cors());
app.use(express.json());
app.use(Routes);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(errors());

app.listen(3333);
