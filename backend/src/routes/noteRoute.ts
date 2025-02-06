import express from "express";
import { upload } from "../config/cloudinary";
import authMiddleware from "../middlewares/authMiddleware";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  uploadImage,
} from "../controllers/noteController";

const router = express.Router();

router.use(authMiddleware);
router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
