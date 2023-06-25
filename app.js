const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/967ffe4f69";
  const options = {
    method: "POST",
    auth: "Saurabh1:3c85570906a8cde6a3cfd1e74e72a366-us21"
  }

  const request = https.request(url, options, function(response) {
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});

// API key
// 3c85570906a8cde6a3cfd1e74e72a366-us21

// Unique/List ID
// 967ffe4f69
