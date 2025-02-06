import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./db";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoute";

// dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ai-notes-shreyansh.vercel.app",
  "https://ainotes-mgm1.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error("The CORS policy does not allow access from this origin."),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

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
app.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("Server is alive");
});
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

console.log(process.env.PORT);
console.log(`mongouri: ${process.env.MONGO_URI}`);
console.log(`jwtsecret: ${process.env.JWT_SECRET}`);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
