const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { url } = require('inspector');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
}); 

app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
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

    const url = "https://us8.api.mailchimp.com/3.0/lists/e8274aec8f";
    const options = {
        method: 'POST',
        auth: 'sarvesh1:eaa536b87e91335c4460afc370e399ef-us8'
    };

    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200) {
            // res.send("Successfully Subscribed!");
            res.sendFile(__dirname + "/success.html");
        }
        else {
            // res.send("There was an error while signing up. Try Again!");
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000"); 
});


// API Key: eaa536b87e91335c4460afc370e399ef-us8
// ListID: e8274aec8f