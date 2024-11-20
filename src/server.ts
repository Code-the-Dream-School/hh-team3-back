import app from "./app";
import swaggerDocs from "./utils/swagger";
import connectDB from "./db/connect";

const { PORT } = process.env;
const port = Number(PORT) || 8000;

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}!`);
      swaggerDocs(app, port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
