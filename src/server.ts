import swaggerJSDoc from "swagger-jsdoc";
import app from "./app"; 
import swaggerDocs from "./utils/swagger";

const { PORT } = process.env;
const port = Number(PORT) || 8000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
  swaggerDocs(app, port);
});
