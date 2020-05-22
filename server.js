const express = require("express");
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//get
app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});
//

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
