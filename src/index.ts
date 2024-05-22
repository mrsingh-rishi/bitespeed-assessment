import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/", router);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
