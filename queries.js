const Pool = require("pg").Pool;
const fs = require("fs");
const csv = require("fast-csv");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "api",
  password: "123456",
  port: 5432,
});

const getCaminhoes = (req, res) => {
  pool.query("SELECT * FROM caminhao ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const getCaminhaoId = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM caminhao WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const createCaminhao = (req, res) => {
  const { apelido, placa, cor, rendimento } = req.body;

  pool.query(
    "INSERT INTO caminhao (apelido, placa, cor, rendimento) VALUES($1, $2, $3, $4) RETURNING *",
    [apelido, placa, cor, rendimento],
    (error, results) => {
      if (error) throw error;

      res.status(201).send("Foi adicionado um novo caminhão");
    }
  );
};

const updateCaminhao = (req, res) => {
  const id = parseInt(request.params.id);
  const { apelido, placa, cor, rendimento } = req.body;

  pool.query(
    "UPDATE caminhao SET apelido = $1, placa = $2, cor = $3, rendimento = $4 WHERE id = $5",
    [apelido, placa, cor, rendimento, id],
    (error, results) => {
      if (error) throw error;

      res.status(200).send(`Caminhao modificado com o ID: ${id}`);
    }
  );
};

const deleteCaminhao = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM caminhao WHERE id = $1", [id], (error, results) => {
    if (error) throw error;

    res.status(200).send(`Caminhao deletado com sucesso, id: ${id}`);
  });
};

const getLocalidades = (req, res) => {
  pool.query("SELECT * FROM localidades ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const upload = async (req, res) => {
  console.log(req.file)
  let stream = fs.createReadStream(req.file.path);
  let csvData = [];
  let csvStream = csv
    .parse({ delimiter: ";" })
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      csvData.shift();
    });
  stream.pipe(csvStream);
  csvData.shift();
  const query =
    "INSERT INTO localidades (id, nome, distancia) VALUES ($1, $2, $3)";
  pool.connect((err, client, done) => {
    if (err) throw err;
    try {
      //console.log(csvData);
      csvData.forEach((row) => {
        //Verificação para números de colunas da planilha
        if (row.length > 3) row.length = 3;
        const rowNew = row.map((oldRow) => {
          if (oldRow.includes(",")) {
            // console.log(String(oldRow.replace(',', '.')))
            return Number(String(oldRow.replace(",", ".")));
          }
          return oldRow;
        });
        //console.log(row)
        client.query(query, rowNew, (err, res) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log("inserted " + res.rowCount + " row:", rowNew);
          }
        });
      });
    } finally {
      done();
      fs.unlink(req.file.path, () => res.end());
    }
  });
  res.send("Arquivo enviado!");
};
module.exports = {
  getCaminhoes,
  getCaminhaoId,
  createCaminhao,
  updateCaminhao,
  deleteCaminhao,
  getLocalidades,
  upload,
};
