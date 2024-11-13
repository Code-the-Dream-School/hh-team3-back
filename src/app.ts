import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import favicon from "express-favicon";
import logger from "morgan";
import dotenv from "dotenv";
import mainRouter from "./routes/mainRouter";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app: Express = express();

// Port configuration
const port = process.env.PORT || 8000;

//connect DB
const connectDB = require("./db/connect");


// Swagger
const swaggerDefinition = {
  openapi: "3.0.0", // specify the Swagger version
  info: {
    title: "My API",
    version: "1.0.0",
    description:
      "API for Book Talk",
  },
  servers: [
    {
      url: `http://localhost:${port}`,
    },
  ],
};

// Options for swagger-jsdoc
const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], // Location of your API annotations
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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