const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express();

//Parsing HTML body of request
app.use(bodyParser.urlencoded({extended: true}));

//accessing public file system -- styles.css, newsletter.jpg
app.use(express.static("public"))

//firing up signup.html
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

// posting to mail chimp
app.post("/", function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    //reference mail chimp API to see how to post
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
    const url = "https://us6.api.mailchimp.com/3.0/lists/5bdffbbb2f"

    const options = {
        method: "POST",
        auth: "mason:1d620b9e32d902cdf531fd787c299e99-us6"
    }

    //request
    const request = https.request(url, options, function(response)
    {
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html")
        
    }
    else 
    {
        res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data){
        //console.log(JSON.parse(data));

    })
    })
    request.write(jsonData)
    request.end();

})



app.listen(process.env.PORT || 3000, function(){
    console.log("server started on port 3000")
});

// 1d620b9e32d902cdf531fd787c299e99-us6

//Audience List ID:
// 5bdffbbb2f