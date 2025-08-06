import express from "express";
import rescueRequestRouter from "../controllers/rescue-request/router";

const router = express.Router();

router.use("/rescue-requests", rescueRequestRouter);

export default router;