//#region include&init
const express = require("express");
const bodyParser = require("body-parser")
const session = require('express-session');
const path = require('path');
// const mysql = require('mysql');



const app = express();
/*
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});
*/

//#endregion include&init

//#region use
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
//#endregion use

//#region functions

// funkcja sprawdza czy uzyszkodnik jest zalogowany czy nie.
function isLogged(req, res)
{
	if (req.session.loggedin)
	{
		return true;
	} 
	else 
	{
		return res.redirect('/logowanie');
	}
}


//#endregion functions


//#region gets

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/rejestracja', function(request, response) {
    response.sendFile(__dirname + "/public/rejestracja.html");
});

app.get('/logowanie', function(request, response) {
    response.sendFile(__dirname + "/public/logowanie.html");
});

//#region pracownik

app.get('/ekranpracownika', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/ekranpracownika.html");
	}
});

app.get('/edytujswojedane', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/edytujswojedane.html");
	}
});

app.get('/godzinyzdniapracy', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/godzinyzdniapracy.html");
	}	
});

//#endregion pracownik

//#region kierownik
app.get('/ekrankierownika', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/ekrankierownika.html");
	}	
});

app.get('/stronaRaportuWidzianaPrzezKierownika', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/stronaRaportuWidzianaPrzezKierownika.html");
	}	
});

app.get('/raportKierownika', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/raportKierownika.html");
	}	
});

app.get('/edycjagodzin', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/edycjagodzin.html");
	}	
});
//#endregion kierownik

//#region admin
app.get('/ekranAdmina', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/ekranAdmina.html");
	}	
});

app.get('/uprawnienia', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/uprawnienia.html");
	}	
});

app.get('/edytujDaneUseraPrzezAdmina', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/edytujDaneUseraPrzezAdmina.html");
	}	
});
//#endregion admin


/*
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!\nYour passwors is: ' + request.session.password);
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
*/
//#endregion gets

//#region posts
/*
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) 
        {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
*/

app.post('/validation', function(request, response) {
	if(request.session.loggedin)
	{
		response.send("OK");
	}else
	{
		response.send("ERROR");
	}
});

// #endregion posts

 //#region listener
app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
//#endregion listener