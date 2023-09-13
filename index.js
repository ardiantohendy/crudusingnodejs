const express = require("express");
const app = express();
const port = 3000;
const db = require("./connection");
const bodyParser = require("body-parser");
const response = require("./response");

app.use(bodyParser.json());

app.get("/student", (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (error, result) => {
    if (error) throw error;
    response(200, result, "Success read all data from brawijaya_university database", res);
  });
});

//specific by student's nim
app.get("/student/:nim", (req, res) => {
  const nim = req.params.nim;
  const sql = `SELECT * FROM students WHERE nim = ${nim}`;
  db.query(sql, (error, result) => {
    try {
      if (result == 0) {
        response(404, `There's no student with NIM ${nim} in brawijaya_university database `, `Not Found!!!`, res);
      } else {
        response(200, result, `Registered`, res);
      }
    } catch (error) {
      throw error;
    }
  });
});

app.post("/student", (req, res) => {
  const { nim, fullName, fakulty, major } = req.body;
  const sql = `INSERT INTO students (nim, name, fakulty, major) VALUES ('${nim}', '${fullName}', '${fakulty}', '${major}')`;
  db.query(sql, (error, result) => {
    if (error) response(500, "invalid", "ERROR", res);
    if (result?.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        id: result.insertId,
      };
      response(200, data, "Data added Successfuly!!", res);
    }
  });
});

app.put("/student", (req, res) => {
  const { nim, fullName, fakulty, major } = req.body;
  const sql = `UPDATE students SET name = '${fullName}', fakulty = '${fakulty}', major = '${major}' WHERE nim = ${nim}`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    if (result?.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        id: result.insertId,
      };
      response(200, data, result.message, res);
    } else if (result?.affectedRows != 1) {
      response(404, "student not found", result.message, res);
    }
    console.log(result);
  });
});

app.delete("/student", (req, res) => {
  const { nim } = req.body;
  const sql = `DELETE FROM students WHERE nim = '${nim}'`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    if (result?.affectedRows) {
      response(200, "Success", "remove student successfuly", res);
    } else {
      response(500, "Invalid", "Error", res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
