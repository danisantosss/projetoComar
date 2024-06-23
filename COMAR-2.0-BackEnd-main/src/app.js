import express from "express";
import routerSistema from "./router/routerProjeto.js";
import cors from "cors";
import routerUsuario from "./router/routerUsuario.js";

const corsOptions = {
  origin: "https://projetocomar.onrender.com",
  optionsSuccessStatus: 200,
};

const app = express();
const port = 10254;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/projeto", routerSistema);
app.use("/usuario", routerUsuario);

app.listen(port, () => {
  console.log(`Server : https://projetocomar.onrender.com:${port}/projeto `);
});