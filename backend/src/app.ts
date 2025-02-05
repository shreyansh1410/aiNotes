import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./db";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoute";
import dotenv from "dotenv";
import path from "path";

// dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

connectDB();

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Something went wrong!" });
  }
);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

console.log(process.env.PORT);
console.log(`mongouri: ${process.env.MONGO_URI}`);
console.log(`jwtsecret: ${process.env.JWT_SECRET}`);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
