import express from "express";
import cors from "cors";
import morgan from "morgan";

// Routers
import userRouter from "./routes/user.js";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/users", userRouter);

// Handling all unhandled routes
app.all("*", (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server`, 404));
});

export default app;
