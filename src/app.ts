import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import favicon from "express-favicon";
import logger from "morgan";
import dotenv from "dotenv";
import mainRouter from "./routes/mainRouter";
import booksRouter from "./routes/bookRoutes";
import { notFoundMiddleware } from "./middleware/not-found"; 
import { errorHandlerMiddleware } from "./middleware/error-handler"; 
import swaggerDocs from "./utils/swagger";

dotenv.config();

const app: Express = express();

const { SWAGGER_PORT } = process.env;
const swaggerPort = Number(SWAGGER_PORT) || 8000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

swaggerDocs(app, swaggerPort); 

// Use main router for API routes
app.use("/api/v1", mainRouter);
app.use("/api/v1/books", booksRouter); 


app.use(notFoundMiddleware); // 404 Not Found handler
app.use(errorHandlerMiddleware); // Global error handler


export default app;
