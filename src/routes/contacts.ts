import express from "express";
import handleRequest from "../controllers/contact";

const contactRouter = express.Router();

contactRouter.post("/", handleRequest);

export default contactRouter;
