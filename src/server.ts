import app from "./app"; 

const { PORT } = process.env;
const port = Number(PORT) || 8000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
