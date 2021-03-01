const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Front = require("../models/Front");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Welcome Page
router.get("/", (req, res) => res.render("welcome"));

// DashBoard
// router.get("/dashboard", ensureAuthenticated, (req, res) =>
//   res.render("dashboard", {
//     name: req.user.name,
//   })
// );

// Dashboard For User's Password List

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Front.find({}, (err, doc) => {
    res.render("dashboard", {
      users: doc,
      username: req.body.username,
      userpassword: req.body.userpassword,
    });
    console.log('hii');
  });
});

// Dashboard For User's Password List Post Route
router.post("/dashboard", urlencodedParser, (req, res) => {
  if (req.body._id == "") insertRecord(req, res);
  else {
    updateRecord(req, res);
  }
});

function insertRecord(req, res) {
  const user = new Front();
  user.username = req.body.username;
  user.userpassword = req.body.userpassword;

  user.save((err, doc) => {
    if (!err) {
      res.render("list", {
        users: doc,
      });
    } else {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
        res.render("dashboard", {
          viewTitle: "Insert User",
          user: req.body,
        });
      } else {
        console.log("Error during record insertion : " + err);
      }
    }
  });
}

function updateRecord(req, res) {
  Front.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send("Hello");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("Dashboard", {
            viewTitle: "Update Employee",
            user: req.body,
          });
        }
      }
    }
  );
}

router.get("/list", (req, res) => {
  Front.find((err, docs) => {
    if (!err) {
      res.render("list", {
        users: docs,
      });
    } else {
      console.log("Error in retrieving employee list : " + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "fullName":
        body["usernameError"] = err.errors[field].message;
        break;
      case "email":
        body["userpasswordError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

module.exports = router;
