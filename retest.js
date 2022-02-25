const express = require("express");
var cors = require("cors");
const fs = require("fs");
var mysql = require('mysql2');

// connecting to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Subha@123',
  database: 'infosys'
});


connection.connect((err) => {
  if (err) { console.log("DB Connection Failed."); return }

  // Initializing Express Server
  const app = express();
  app.use(cors({
    origin: "*",
  }));


  //Routes/Apis
  app.use("/readFile", async (req, res) => {
    res.end(await fs.readFileSync("./data.json"))
  });


  // display
  app.get("/infosys", (req, res) => {
    connection.query("SELECT * FROM spring;", (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  app.get("/Department", (req, res) => {
    connection.query("SELECT emp_deg,emp_name FROM spring;", (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })


  // search
  app.get("/search", (req, res) => {
        if (!req.query.emp_salary) {
          res.json({ error: "Enter the Salary" })
          return
        }
        var emp_salary = req.query.emp_salary
    connection.query(`SELECT * FROM spring WHERE emp_salary > ${emp_salary}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  

  // // add 
  app.get("/add", (req, res) => {
    if (!req.query.emp_id) {
      res.json({ error: "Employee id required" })
      return
    }

    if (!req.query.emp_name) {
      res.json({ error: "Employee name not filled" })
      return
    }
    if (!req.query.emp_deg) {
      res.json({ error: "Designation not filled" })
      return
    }
    if (!req.query.emp_dept) {
      res.json({ error: "Department needed" })
      return
    }
    if (!req.query.emp_salary) {
      res.json({ error: "Salary needed" })
      return
    }
    if (!req.query.emp_location) {
      res.json({ error: "Location found" })
      return
    }
    

    connection.query(`INSERT INTO spring(emp_id,emp_name,emp_deg,emp_dept,emp_salary,emp_location) ` +
      `VALUES(${req.query.emp_id},'${req.query.emp_name}','${req.query.emp_deg}','${req.query.emp_dept}','${req.query.emp_salary}','${req.query.emp_location}')`,
      (err, results, fields) => {
        if (err) return res.json({ error: err.message })
        res.json(results)
      })
  })

  // // update
  app.get("/update", (req, res) => {
    if (!req.query.emp_location) {
      res.json({ error: "employee department required" })
      return
    }

    var emp_location = req.query.emp_location
    connection.query(`UPDATE spring SET emp_location= ${emp_location} WHERE emp_location = 'Mumbai'`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // delete
  app.get("/delete", (req, res) => {
    if (!req.query.emp_id) {
      res.json({ error: "Reg no required" })
      return
    }

    var emp_id = req.query.emp_id
    connection.query(`DELETE FROM spring WHERE emp_id = ${emp_id}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })


  //Port
  const port = 7000;

  //Starting a server
  app.listen(port, () => {
    console.log(`* SERVER STARTED AT PORT ${port} *`);
  });

})