import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import favicon from "express-favicon";
import logger from "morgan";
import dotenv from "dotenv";
import mainRouter from "./routes/mainRouter";

// import swaggerJSDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

dotenv.config();

const app: Express = express();

// Port configuration
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

// Use main router for API routes
app.use("/api/v1", mainRouter);


export default app;