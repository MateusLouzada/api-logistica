const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const db = require("./queries");

const port = 8080;

const upload = multer({ dest: "uploads/" });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origins, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ inf: "Node.js, Express and Postgres API" });
});

app.get("/caminhoes", db.getCaminhoes);
app.get("/caminhoes/:id", db.getCaminhaoId);
app.post("/caminhoes", db.createCaminhao);
app.put("/caminhoes/:id", db.updateCaminhao);
app.delete("/caminhoes/:id", db.deleteCaminhao);

app.get("/localidades", db.getLocalidades)
app.post("/upload", upload.single("file"), db.upload);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
