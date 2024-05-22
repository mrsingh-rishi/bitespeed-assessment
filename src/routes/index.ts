import express, { Router } from "express";
import contactRouter from "./contacts";
const router = express.Router();

router.use("/identify", contactRouter);

export default router;
