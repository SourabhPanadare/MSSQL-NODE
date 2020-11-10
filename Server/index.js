var _sqlPackage = require("mssql");
//require("msnodesqlv8");/*-------------------Windows Authentication-------------*/
var _expressPackage = require("express");
var inputData = require("./sampledata.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

var app = _expressPackage();

//config for your database SQL Server Auth
const dbConfig = {
  user: "sourabh",
  password: "sourabh@123",
  server: "SOURABH-PC\\SQLEXPRESS", /*---------IP Address-----------*/
  database: "mern",
  //parseJSON: true,
};

//config for your database Winsdows Auth
// const dbConfig = {
//   database: "mern",
//   server: "SOURABH-PC\\SQLEXPRESS",
//   driver: "msnodesqlv8",
//   options: {
//     trustedConnection: true
//   }
// };

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "mobileqa@sanginfo.com", // generated ethereal user
    pass: "b!pr@bh@t", // generated ethereal password
  },
});

const accessTokenSecret = "quoteunquote";

//middleware
app.use(_expressPackage.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
    //res.setHeader("Access-Control-Allow-Headers", "*"),
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,X-Custom-Header"
  );

  next();
});

//generate hashed passwords to store in DB
const saltRounds = 10;
const myPlaintextPassword = "test";

//Function to connect to database and execute query
var QueryToExecuteInDatabase = function (response, strQuery, params = null) {
  //close sql connection before creating an connection otherwise you will get an error if connection already exists.
  _sqlPackage.close();
  //Now connect your sql connection
  _sqlPackage.connect(dbConfig, function (error) {
    if (error) {
      console.log("Error while connecting to database :- " + error);
      response.send(error);
    } else {
      //let's create a request for sql object
      var request = new _sqlPackage.Request();
      //Query to run in our database
      request.execute(strQuery, function (error, responseResult) {
        if (error) {
          console.log("Error while connecting to database:- " + error);
          response.send(error);
        } else {
          response.send(responseResult.recordsets);
        }
      });
    }
  });
};


app.get("/", function (_req, _res) {
  _res.send("<h1>Node Server</h1>");
});
app.get("/Masters", function (_req, _res) {
  var Sqlquery = "uspGetInputMasters";
  QueryToExecuteInDatabase(_res, Sqlquery);
});
app.post("/AddNewQuotation", function (_req, _res) {
  var Sqlquery = "uspAddQuotation";
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("CustomerID", _sqlPackage.BigInt, _req.body.CustomerID)
        .input("UserID", _sqlPackage.BigInt, _req.body.UserID)
        .input(
          "ProductionLineCode",
          _sqlPackage.Char(5),
          _req.body.ProductionLineCode
        )
        .input("QuoteDate", _sqlPackage.Date, _req.body.QuoteDate)
        .input("QuoteNumber", _sqlPackage.VarChar(50), _req.body.QuoteNumber)
        .input("Gauge", _sqlPackage.Float, _req.body.Gauge)
        .input("SheetWidth", _sqlPackage.Float, _req.body.SheetWidth)
        .input("SheetLength", _sqlPackage.Float, _req.body.SheetLength)
        .input("NumberOfSheets", _sqlPackage.Int, _req.body.NumberOfSheets)
        .input("CoilWidth", _sqlPackage.Float, null)
        .input("PoundPercCoil", _sqlPackage.Float, _req.body.PoundPercCoil)
        .input("MaxCustSkid", _sqlPackage.Int, _req.body.MaxCustSkid)
        .input("ReplacementCost", _sqlPackage.Float, _req.body.ReplacementCost)
        .input("PaperPlasticWrap", _sqlPackage.Bit, _req.body.PaperPlasticWrap)
        .input("SkidType", _sqlPackage.VarChar(50), _req.body.SkidType)
        .input("RunToFinish", _sqlPackage.Bit, _req.body.RunToFinish)
        .input(
          "ProcessingCostSheet",
          _sqlPackage.Float,
          _req.body.ProcessingCostSheet
        )
        .input(
          "LineSetupCostSheet",
          _sqlPackage.Float,
          _req.body.LineSetupCostSheet
        )
        .input(
          "MaterialCostSheet",
          _sqlPackage.Float,
          _req.body.MaterialCostSheet
        )
        .input("SubTotalSheet", _sqlPackage.Float, _req.body.SubTotalSheet)
        .input("SkidCostSheet", _sqlPackage.Float, _req.body.SkidCostSheet)
        .input(
          "PaperWrapCostSheet",
          _sqlPackage.Float,
          _req.body.PaperWrapCostSheet
        )
        .input("TotalCostSheet", _sqlPackage.Float, _req.body.TotalCostSheet)
        .input(
          "ProcessingCostCWT",
          _sqlPackage.Float,
          _req.body.ProcessingCostCWT
        )
        .input(
          "LineSetupCostCWT",
          _sqlPackage.Float,
          _req.body.LineSetupCostCWT
        )
        .input("MaterialCostCWT", _sqlPackage.Float, _req.body.MaterialCostCWT)
        .input("SubTotalSCWT", _sqlPackage.Float, _req.body.SubTotalSCWT)
        .input("SkidCostCWT", _sqlPackage.Float, _req.body.SkidCostCWT)
        .input(
          "PaperWrapCostCWT",
          _sqlPackage.Float,
          _req.body.PaperWrapCostCWT
        )
        .input("TotalCostCWT", _sqlPackage.Float, _req.body.TotalCostCWT)
        .input(
          "ProposedPriceCWT",
          _sqlPackage.Float,
          _req.body.ProposedPriceCWT
        )
        .input("Margin", _sqlPackage.Float, _req.body.Margin)
        .input("PercentMargin", _sqlPackage.Float, _req.body.PercentMargin)
        .input("TotalPounds", _sqlPackage.Int, _req.body.TotalPounds)
        .input("ProdHrs", _sqlPackage.Float, _req.body.ProdHrs)
        .input("Submitted", _sqlPackage.Char(10), "")
        .input("Approved", _sqlPackage.Bit, _req.body.Approved)
        .input("ApprovedDate", _sqlPackage.Date, _req.body.ApprovedDate)
        .input("ApprovedBy", _sqlPackage.Char(50), "")
        .input("Remarks", _sqlPackage.VarChar(250), "")
        .input("Type", _sqlPackage.VarChar(50), _req.body.Type)
        .output("Response", _sqlPackage.BigInt)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.output);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.post("/AddUser", function (_req, _res) {
  console.log(_req.body);

  _sqlPackage.close();
  var Sqlquery = "uspTestAddUser";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("FirstName", _sqlPackage.VarChar(100), _req.body.FirstName)
        .input("LastName", _sqlPackage.VarChar(100), _req.body.LastName)
        .output("Response", _sqlPackage.BigInt)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.output.Response);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.post("/Quotations", function (_req, _res) {
  _sqlPackage.close();
  var Sqlquery = "uspGetQuotations";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.VarChar(50), _req.body.ID)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordsets);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
app.get("/Quotation/:id", async function (_req, _res) {
  // Retrieve the tag from our URL path
  var id = _req.params.id;
  var Sqlquery = "uspGetQuotation";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, id)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordsets);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
app.post("/AuthenticateUser", function (_req, _res) {
  console.log(_req.body);
  _sqlPackage.close();
  var Sqlquery = "uspAuthenticateUser";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("UserName", _sqlPackage.VarChar(50), _req.body.username)
        .input("Pwd", _sqlPackage.VarChar(50), _req.body.password)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      bcrypt
        .compare(_req.body.password, result.recordset[0].Password)
        .then(function (match) {
          // result == false
          console.log(match);
          if (match) {
            _res.send(result.recordset);
          } else {
            _res.send([]);
          }
        });
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
app.get("/encryptpwd", function (_req, _res) {
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });
});

app.get("/States", function (_req, _res) {
  var Sqlquery = "uspGetStates";
  QueryToExecuteInDatabase(_res, Sqlquery);
});
app.get("/Admin/Masters", function (_req, _res) {
  var Sqlquery = "uspGetAdminMasters";
  QueryToExecuteInDatabase(_res, Sqlquery);
});

/*CRUD API calls start */

/*List */
app.get("/Customers", function (_req, _res) {
  var Sqlquery = "uspGetCustomers";
  QueryToExecuteInDatabase(_res, Sqlquery);
});
/*Detail */
app.get("/Customer/:id", async function (_req, _res) {
  // Retrieve the tag from our URL path
  var id = _req.params.id;
  var Sqlquery = "uspGetCustomer";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, id)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordsets);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
/*Update */
app.put("/Customer", function (_req, _res) {
  _sqlPackage.close();
  var Sqlquery = "uspUpdateCustomer";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.body.id)
        .input("Name", _sqlPackage.VarChar(150), _req.body.Name)
        .input("Address1", _sqlPackage.VarChar(150), _req.body.Address1)
        .input("Address2", _sqlPackage.VarChar(150), _req.body.Address2)
        .input("City", _sqlPackage.VarChar(50), _req.body.City)
        .input("State", _sqlPackage.VarChar(50), _req.body.State)
        .input("Zip", _sqlPackage.VarChar(20), _req.body.Zip)
        .input("UserID", _sqlPackage.BigInt, _req.body.UserID)
        .input("Active", _sqlPackage.Bit, _req.body.Active)

        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
/*Create */
app.post("/Customer", function (_req, _res) {
  _sqlPackage.close();
  var Sqlquery = "uspAddCustomer";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("Name", _sqlPackage.VarChar(150), _req.body.Name)
        .input("Address1", _sqlPackage.VarChar(150), _req.body.Address1)
        .input("Address2", _sqlPackage.VarChar(150), _req.body.Address2)
        .input("City", _sqlPackage.VarChar(50), _req.body.City)
        .input("State", _sqlPackage.VarChar(50), _req.body.State)
        .input("Zip", _sqlPackage.VarChar(20), _req.body.Zip)
        .input("User", _sqlPackage.BigInt, _req.body.User)
        .input("Active", _sqlPackage.Bit, _req.body.Active)
        .output("Response", _sqlPackage.BigInt)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.output.Response);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
/*Delete */
app.delete("/Customer/:id", async function (_req, _res) {
  var Sqlquery = "uspDeleteCustomer";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.params.id)
        .execute(Sqlquery);
    })
    .then((result) => {
      _res.send(`Deleted customer ${_req.params.id}`);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/PLCodes", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool.request().query("select * from ProductionLine");
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordset);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
}); //Lets set up our local server now.

//Create new PL Code
app.post("/PLCode", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(`Insert into ProductionLine (Code) values('${_req.body.Code}')`);
    })
    .then(() => {
      _res.send("Row inserted");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
//Edit PL Code
app.put("/PLCode", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `Update ProductionLine SET Code = '${_req.body.Code}' where ProductionLineID = ${_req.body.ID}`
        );
    })
    .then(() => {
      _res.send("Row updated");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
//Delete PL

app.delete("/PLCode/:id", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `Delete From ProductionLine where ProductionLineID = ${_req.params.id}`
        );
    })
    .then(() => {
      _res.send("Row deleted");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/SkidTypes", (_req, _res) => {
  var Sqlquery = "uspGetSkidTypes";
  QueryToExecuteInDatabase(_res, Sqlquery);
});

app.get("/SkidType/:id", (_req, _res) => {
  var id = _req.params.id;
  var Sqlquery = "uspGetSkidType";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, id)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordsets);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.post("/SkidType", (_req, _res) => {
  _sqlPackage.close();
  var Sqlquery = "uspAddSkidType";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("Desc", _sqlPackage.VarChar(50), _req.body.Desc)
        .input("SortCode", _sqlPackage.Char(4), _req.body.SortCode)
        .input("SkidCost", _sqlPackage.Float, _req.body.SkidCost)
        .input("WrapCost", _sqlPackage.Float, _req.body.WrapCost)
        .input("Width", _sqlPackage.Int, _req.body.Width)
        .input("Length", _sqlPackage.Int, _req.body.Length)
        .output("Response", _sqlPackage.BigInt)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.output.Response);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.put("/SkidType", (_req, _res) => {
  _sqlPackage.close();
  var Sqlquery = "uspUpdateSkidType";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.body.ID)
        .input("Desc", _sqlPackage.VarChar(50), _req.body.Desc)
        .input("SortCode", _sqlPackage.Char(4), _req.body.SortCode)
        .input("SkidCost", _sqlPackage.Float, _req.body.SkidCost)
        .input("WrapCost", _sqlPackage.Float, _req.body.WrapCost)
        .input("Width", _sqlPackage.Int, _req.body.Width)
        .input("Length", _sqlPackage.Int, _req.body.Length)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.delete("/SkidType/:id", (_req, _res) => {
  var Sqlquery = "uspDeleteSkidType";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.params.id)
        .execute(Sqlquery);
    })
    .then((result) => {
      _res.send(`Deleted SkidType ${_req.params.id}`);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/SheetWidth", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool.request().query("select * from SheetWidth");
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordset);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
}); //Lets set up our local server now.

//Create new PL Code
app.post("/SheetWidth", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `Insert into SheetWidth (SheetWidth) values('${_req.body.SheetWidth}')`
        );
    })
    .then(() => {
      _res.send("Row inserted");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
//Edit PL Code
app.put("/SheetWidth", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `Update SheetWidth SET SheetWidth = '${_req.body.SheetWidth}' where SheetWidthID = ${_req.body.ID}`
        );
    })
    .then(() => {
      _res.send("Row updated");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
//Delete PL

app.delete("/SheetWidth/:id", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(`Delete From SheetWidth where SheetWidthID = ${_req.params.id}`);
    })
    .then(() => {
      _res.send("Row deleted");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.put("/Quotation", (_req, _res) => {
  _sqlPackage.close();
  var Sqlquery = "uspUpdateQuotation";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.body.ID)
        .input("CustomerID", _sqlPackage.BigInt, _req.body.CustomerID)
        .input("UserID", _sqlPackage.BigInt, _req.body.UserID)
        .input(
          "ProductionLineCode",
          _sqlPackage.Char(5),
          _req.body.ProductionLineCode
        )
        .input("QuoteDate", _sqlPackage.Date, _req.body.QuoteDate)
        .input("Gauge", _sqlPackage.Float, _req.body.Gauge)
        .input("SheetWidth", _sqlPackage.Float, _req.body.SheetWidth)
        .input("SheetLength", _sqlPackage.Float, _req.body.SheetLength)
        .input("NumberOfSheets", _sqlPackage.Int, _req.body.NumberOfSheets)
        .input("CoilWidth", _sqlPackage.Float, null)
        .input("PoundPercCoil", _sqlPackage.Float, _req.body.PoundPercCoil)
        .input("MaxCustSkid", _sqlPackage.Int, _req.body.MaxCustSkid)
        .input("ReplacementCost", _sqlPackage.Float, _req.body.ReplacementCost)
        .input("PaperPlasticWrap", _sqlPackage.Bit, _req.body.PaperPlasticWrap)
        .input("SkidType", _sqlPackage.VarChar(50), _req.body.SkidType)
        .input("RunToFinish", _sqlPackage.Bit, _req.body.RunToFinish)
        .input(
          "ProcessingCostSheet",
          _sqlPackage.Float,
          _req.body.ProcessingCostSheet
        )
        .input(
          "LineSetupCostSheet",
          _sqlPackage.Float,
          _req.body.LineSetupCostSheet
        )
        .input(
          "MaterialCostSheet",
          _sqlPackage.Float,
          _req.body.MaterialCostSheet
        )
        .input("SubTotalSheet", _sqlPackage.Float, _req.body.SubTotalSheet)
        .input("SkidCostSheet", _sqlPackage.Float, _req.body.SkidCostSheet)
        .input(
          "PaperWrapCostSheet",
          _sqlPackage.Float,
          _req.body.PaperWrapCostSheet
        )
        .input("TotalCostSheet", _sqlPackage.Float, _req.body.TotalCostSheet)
        .input(
          "ProcessingCostCWT",
          _sqlPackage.Float,
          _req.body.ProcessingCostCWT
        )
        .input(
          "LineSetupCostCWT",
          _sqlPackage.Float,
          _req.body.LineSetupCostCWT
        )
        .input("MaterialCostCWT", _sqlPackage.Float, _req.body.MaterialCostCWT)
        .input("SubTotalSCWT", _sqlPackage.Float, _req.body.SubTotalSCWT)
        .input("SkidCostCWT", _sqlPackage.Float, _req.body.SkidCostCWT)
        .input(
          "PaperWrapCostCWT",
          _sqlPackage.Float,
          _req.body.PaperWrapCostCWT
        )
        .input("TotalCostCWT", _sqlPackage.Float, _req.body.TotalCostCWT)
        .input(
          "ProposedPriceCWT",
          _sqlPackage.Float,
          _req.body.ProposedPriceCWT
        )
        .input("Margin", _sqlPackage.Float, _req.body.Margin)
        .input("PercentMargin", _sqlPackage.Float, _req.body.PercentMargin)
        .input("TotalPounds", _sqlPackage.Int, _req.body.TotalPounds)
        .input("ProdHrs", _sqlPackage.Float, _req.body.ProdHrs)
        .input("Type", _sqlPackage.VarChar(50), _req.body.Type)
        .input("EditedBy", _sqlPackage.BigInt, _req.body.EditedBy)
        .output("Response", _sqlPackage.BigInt)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.delete("/Quotation/:id", async function (_req, _res) {
  var Sqlquery = "uspDeleteQuotation";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.params.id)
        .execute(Sqlquery);
    })
    .then((result) => {
      _res.send(`Deleted quotation ${_req.params.id}`);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/Users", (_req, _res) => {
  var Sqlquery = "uspGetUsers";
  QueryToExecuteInDatabase(_res, Sqlquery);
});
app.get("/User/:id", (_req, _res) => {
  var id = _req.params.id;
  var Sqlquery = "uspGetUser";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, id)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordset);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
app.post("/User", (_req, _res) => {
  _sqlPackage.close();
  var Sqlquery = "uspAddUser";
  let _plainTextPwd = _req.body.Pwd;
  let _data;
  bcrypt.hash(_plainTextPwd, saltRounds).then(function (hash) {
    // Store hash in your password DB.
    _sqlPackage
      .connect(dbConfig)
      .then((pool) => {
        // Stored procedure

        return pool
          .request()

          .input("FirstName", _sqlPackage.VarChar(50), _req.body.FirstName)
          .input("LastName", _sqlPackage.VarChar(50), _req.body.LastName)
          .input("UserName", _sqlPackage.VarChar(150), _req.body.UserName)
          .input("Pwd", _sqlPackage.VarChar(250), hash)
          .input("Type", _sqlPackage.VarChar(50), _req.body.Type)
          .input("IsActive", _sqlPackage.Bit, _req.body.IsActive)
          .output("Response", _sqlPackage.BigInt)
          .execute(Sqlquery);
      })
      .then((result) => {
        console.dir(result);
        _res.send(result.output.Response);
      })
      .catch((err) => {
        // ... error checks
        console.log("Error while connecting to database:- " + err);
        _res.send(err);
      });
  });
});
app.put("/User", (_req, _res) => {
  _sqlPackage.close();
  var Sqlquery = "uspEditUser";
  let _pwdToSave;
  if (_req.body.Pwd == _req.body.OldPwd) {
    //No change in password
    _pwdToSave = _req.body.OldPwd;
  } else {
    bcrypt.compare(_req.body.Pwd, _req.body.OldPwd).then(function (match) {
      // result == false
      console.log(match);
      if (match) {
        _pwdToSave = _req.body.OldPwd;
      } else {
        bcrypt.hash(_req.body.Pwd, saltRounds, function (err, hash) {
          // Store hash in your password DB.
          console.log(err);
          _pwdToSave = hash;
        });
      }
    });
  }

  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.body.ID)
        .input("FirstName", _sqlPackage.VarChar(50), _req.body.FirstName)
        .input("LastName", _sqlPackage.VarChar(50), _req.body.LastName)
        .input("UserName", _sqlPackage.VarChar(150), _req.body.UserName)
        .input("Pwd", _sqlPackage.VarChar(250), _pwdToSave)
        .input("Type", _sqlPackage.VarChar(50), _req.body.Type)
        .input("IsActive", _sqlPackage.Bit, _req.body.IsActive)
        .output("Response", _sqlPackage.BigInt)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.output.Response);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
app.delete("/User/:id", (_req, _res) => {
  var Sqlquery = "uspDeleteUser";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.params.id)
        .execute(Sqlquery);
    })
    .then((result) => {
      _res.send(`Deleted SkidType ${_req.params.id}`);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/SheetLength", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool.request().query("select * from SheetLength");
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordset);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
}); //Lets set up our local server now.

//Create new PL Code
app.post("/SheetLength", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `Insert into SheetLength (SheetLength) values('${_req.body.SheetLength}')`
        );
    })
    .then(() => {
      _res.send("Row inserted");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
//Edit PL Code
app.put("/SheetLength", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `Update SheetLength SET SheetLength = '${_req.body.SheetLength}' where SheetLengthID = ${_req.body.ID}`
        );
    })
    .then(() => {
      _res.send("Row updated");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
//Delete PL

app.delete("/SheetLength/:id", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `Delete From SheetLength where SheetLengthID = ${_req.params.id}`
        );
    })
    .then(() => {
      _res.send("Row deleted");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/ManageGauge", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool.request().query("select * from Gauge order by SortValue asc");
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordset);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
}); //Lets set up our local server now.

//Create new PL Code
app.post("/ManageGauge", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `Insert into Gauge (Inches, SortValue, TrueInches) values('${_req.body.Inches}', '${_req.body.SortValue}', '${_req.body.TrueInches}')`
        );
    })
    .then(() => {
      _res.send("Row inserted");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
//Edit PL Code
app.put("/ManageGauge", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `Update Gauge SET Inches = '${_req.body.Inches}', SortValue = '${_req.body.SortValue}', TrueInches = '${_req.body.TrueInches}' where GaugeID = ${_req.body.ID}`
        );
    })
    .then(() => {
      _res.send("Row updated");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});
//Delete PL

app.delete("/ManageGauge/:id", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(`Delete From Gauge where GaugeID = ${_req.params.id}`);
    })
    .then(() => {
      _res.send("Row deleted");
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/PLParameters", (_req, _res) => {
  var Sqlquery = "uspGetPLParameters";
  QueryToExecuteInDatabase(_res, Sqlquery);
});

app.get("/PLParameter/:id", (_req, _res) => {
  var id = _req.params.id;
  var Sqlquery = "uspGetPLParameter";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, id)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordset);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.post("/PLParameter", (_req, _res) => {
  _sqlPackage.close();
  var Sqlquery = "uspAddPLParameter";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ProdLineID", _sqlPackage.Int, _req.body.ProdLineID)
        .input("Code", _sqlPackage.Char, _req.body.Code)
        .input("Coeffecient", _sqlPackage.Float, _req.body.Coeffecient)
        .input("Length", _sqlPackage.Float, _req.body.Length)
        .input("Thickness", _sqlPackage.Float, _req.body.Thickness)
        .input("Width", _sqlPackage.Float, _req.body.Width)
        .input("SetupLength", _sqlPackage.Int, _req.body.SetupLength)
        .input("SetupThickness", _sqlPackage.Int, _req.body.SetupThickness)
        .input("CoilSetup", _sqlPackage.Int, _req.body.CoilSetup)
        .input("SkidTimeChange", _sqlPackage.Int, _req.body.SkidTimeChange)
        .input("PullCoil", _sqlPackage.Int, _req.body.PullCoil)
        .input("LineMaxSkidWidth", _sqlPackage.Int, _req.body.LineMaxSkidWidth)
        .input("CostPerLine", _sqlPackage.Int, _req.body.CostPerLine)
        .output("Response", _sqlPackage.BigInt)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.output.Response);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.put("/PLParameter", (_req, _res) => {
  _sqlPackage.close();
  var Sqlquery = "uspUpdatePLParameter";
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.body.ID)
        .input("ProdLineID", _sqlPackage.Int, _req.body.ProdLineID)
        .input("Code", _sqlPackage.Char, _req.body.Code)
        .input("Coeffecient", _sqlPackage.Float, _req.body.Coeffecient)
        .input("Length", _sqlPackage.Float, _req.body.Length)
        .input("Thickness", _sqlPackage.Float, _req.body.Thickness)
        .input("Width", _sqlPackage.Float, _req.body.Width)
        .input("SetupLength", _sqlPackage.Int, _req.body.SetupLength)
        .input("SetupThickness", _sqlPackage.Int, _req.body.SetupThickness)
        .input("CoilSetup", _sqlPackage.Int, _req.body.CoilSetup)
        .input("SkidTimeChange", _sqlPackage.Int, _req.body.SkidTimeChange)
        .input("PullCoil", _sqlPackage.Int, _req.body.PullCoil)
        .input("LineMaxSkidWidth", _sqlPackage.Int, _req.body.LineMaxSkidWidth)
        .input("CostPerLine", _sqlPackage.Int, _req.body.CostPerLine)
        .execute(Sqlquery);
    })
    .then((result) => {
      console.dir(result);
      _res.send(result);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.delete("/PLParameter/:id", (_req, _res) => {
  var Sqlquery = "uspDeletePLParameter";

  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .input("ID", _sqlPackage.BigInt, _req.params.id)
        .execute(Sqlquery);
    })
    .then((result) => {
      _res.send(`Deleted Product Line Parameters ${_req.params.id}`);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/PLCodes/v2", function (_req, _res) {
  var Sqlquery = "uspGetPLCodes";
  QueryToExecuteInDatabase(_res, Sqlquery);
});

app.get("/SortValues/SkidType", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          "select * from SortValues WHERE SortValue NOT IN (SELECT SortCode FROM SkidType) order by SortValue "
        );
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordset);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/SortValues/ManageGauge", (_req, _res) => {
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          "select * from SortValues WHERE SortValue NOT IN (SELECT ISNULL(SortValue,'') FROM Gauge) order by SortValue"
        );
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordset);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

app.get("/ManageGauge/:id", (_req, _res) => {
  var id = _req.params.id;
  _sqlPackage.close();
  _sqlPackage
    .connect(dbConfig)
    .then((pool) => {
      // Stored procedure

      return pool
        .request()
        .query(
          `select * from SortValues WHERE SortValue NOT IN (SELECT ISNULL(SortValue,'') FROM Gauge WHERE GaugeID <> ${_req.params.id}) order by SortValue`
        );
    })
    .then((result) => {
      console.dir(result);
      _res.send(result.recordset);
    })
    .catch((err) => {
      // ... error checks
      console.log("Error while connecting to database:- " + err);
      _res.send(err);
    });
});

// send mail with defined transport object
const sendMail = (
  subject = "",
  body = "",
  footer = "",
  email = "",
  pwd = "",
  name = ""
) => {
  let strHTML = `<!DOCTYPE html>
                <html lang="en">
                <head><title>Bootstrap Example</title>
                <meta charset="utf-8"><meta content="width=device-width, initial-scale=1" name="viewport">
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
                </head>
                <body>
                <div class="container" style="max-width:500px;">
                <div class="row">
                <div class="col-md-12" style="background-color:#ffffff; margin:1.5em auto 0; padding:20px;">
                <div class="row"><div contenteditable="false" class="col-md-12">
                <div style="background-color:#435966;padding:10px;">
                <img src="http://merit.vikingind.com:8086/QuoteEstimator/static/media/meritusa.2ba553ff.png" style="margin-left: auto;margin-right: auto;display:block">
                <h4 style="text-align:center; color:#FFF;margin-bottom:-2px;text-tranform:capitalize">Merit Quote Assistant</h4>
                </div></div></div>
                <div class="row">
                <div class="col-md-12">
                <div style="margin-top:20px;">
                <div style="color:#6c7b88">
                <p style="color:#696969;font-weight:bold;text-tranform:capitalize">
                Hello <span contenteditable="false">${name}</span>,</p>
                <p>Welcome to Merit Quote Assistant!</p>
                <p>Your account has been activated and is ready to use.</p>
                <p>Here are your credentials:</p>
                <p>User name: <span contenteditable="false">${email}</span></p>
                <p>Password: <span contenteditable="false">${pwd}</span></p>
                <div contenteditable="false" style="text-align:center">
                <a href="http://merit.vikingind.com:8086/QuoteEstimator/Login" itemprop="url" 
                style="text-decoration: none;color: #FFF;background-color: #435966;border: solid #435966;
                border-width: 10px 20px;line-height: 2em;font-weight: bold;text-align: center;
                cursor: pointer;display: inline-block;text-transform: capitalize;">
                Get Started</a>
                </div></div></div></div></div></div></div>
                <div class="row">
                <br/><br/>
                <p style="font-size:11px">This email was sent from an unmonitored account. 
                Please do not reply to this email. If you need any assistance, contact support.</p>
                <div class="col-md-12">
                <div style="color:#6c7b88;text-align:center;padding-top:20px;font-size:12px;line-height:70%;padding-bottom:20px">
                <br/><br/>
                <p>Merit USA &copy;2020 - 2021</p>
                </div></div></div></div></body></html>`;
  let info = transporter.sendMail({
    from: '"Mobile QA 👻" <mobileqa@sanginfo.com>', // sender address
    to: "shweta.deshmukh@sanginfo.com", // list of receivers
    subject: subject, // Subject line
    //text: "Hello world?", // plain text body
    html: strHTML, // html body
  });
};

const encryptPassword = (txtPassword) => {
  let _data;
  bcrypt.hash(txtPassword, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    console.log(err);
    _data = hash;
  });
  return _data;
};

//Lets set up our local server now.
var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});
