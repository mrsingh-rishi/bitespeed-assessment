import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
