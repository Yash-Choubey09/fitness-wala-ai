import express from "express";
import { chatWithAssistant } from "../controllers/aiController.js";

const router = express.Router();

router.post("/", chatWithAssistant);
router.post("/chat", chatWithAssistant); // support both

export default router;
