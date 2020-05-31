//#region include&init
const express = require("express");
const bodyParser = require("body-parser")
const session = require('express-session');
const path = require('path');
 const mysql = require('mysql');



const app = express();

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'mysql',
	database : 'beznazwy'
});


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

//#endregion gets

//#region posts

app.post("/admin_usun", function(request, response)
{
	let id = request.body.id;
	connection.query('SELECT * FROM `teams` WHERE `id_user` = ?',[id], function(error, results, fields)
	{
		if(results.length > 0)
		{
			for(let i = 0; i < results.length; i++)
			{
				connection.query('DELETE FROM `teams` WHERE `id_user` = ?',[id], function(error, results, fields){console.log(error)});
			}
		}
	});
	connection.query('DELETE FROM `users` WHERE `id_user` = ?',[id], function(error, results, fields){});
	response.redirect('/edytujDaneUseraPrzezAdmina');
});
// admin - zmiana danych
app.post("/admin_zmien", function(request, response)
{
	let imie = request.body.imie;
	let nazwisko = request.body.nazwisko;
	let haslo = request.body.haslo;
	let phaslo = request.body.phaslo;
	let login = request.body.login;
	let id = request.body.id;
	if(haslo === phaslo)
	{
		if(imie && imie!==request.session.imie)
		{
			connection.query('UPDATE `users` SET `imie` = ? WHERE `users`.`id_user` = ?', [imie, id], function(error, results, fields){});
		}
		if(nazwisko && nazwisko!==request.session.nazwisko)
		{
			connection.query('UPDATE `users` SET `nazwisko` = ? WHERE `users`.`id_user` = ?', [nazwisko, id], function(error, results, fields){});
		}
		if(haslo !== request.session.password)
		{
			connection.query('UPDATE `users` SET `haslo` = ? WHERE `users`.`id_user` = ?', [haslo, id], function(error, results, fields){});
		}
		if(login && login!==request.session.username)
		{
			connection.query('UPDATE `users` SET `nazwisko` = ? WHERE `users`.`id_user` = ?', [login, id], function(error, results, fields){});
		}
		response.redirect('/ekranAdmina');
		response.end();
	}
	else
	{
		response.redirect("/edytujDaneUseraPrzezAdmina");
		response.end();
	}

});

// zmiana uprawnien
app.post("/admin_Permission", function(request, response)
{
	
	connection.query('UPDATE `users` SET `stanowisko` = ? WHERE `users`.`id_user` = ?',[ request.body.job, request.body.idd], function(error, results, fields){});
	response.send("Success");
});

// admin - all users
app.post("/admin_getUsers", function(request, response)
{
	connection.query('SELECT * FROM `users`', function(error, results, fields)
	{
		if(results.length > 0)
		{
			let data = [];
			for(let i = 0; i < results.length; i++)
			{
				if(results[i].id_user !== request.session.id_user)
				{
					data.push(
						{	id : results[i].id_user,
							imie : results[i].imie,
							nazwisko : results[i].nazwisko,
							stanowisko : results[i].stanowisko
						});
				}
			}
			response.send(data);
		}
		else
		{

		}
	});
});

// pracownik wysyla raport
app.post("/pr_sendRaport", function(request, response)
{
	let packet = [];	
	for(let i in request.body)
	{	
		packet.push(request.body[i]);	
	}
	
	// dodaje raport
	connection.query('INSERT INTO `raporty` (`id_raportu`, `id_projektu`, `data`, `opis`) VALUES (NULL, ?, ?, ?) ', [packet[0], packet[2], packet[3]], function(error, results, fields){});
	// pobieram godziny
	var czas = 0;
	connection.query('SELECT * FROM `teams` WHERE id_user LIKE ? AND id_projektu LIKE ? ', [request.session.id_user, packet[0]], function(error, results, fields)
	{
		if(results.length > 0)
		{
			czas = parseInt(results[0].czas);
			czas = czas + parseInt(packet[1]);
			// zmieniam godziny
			connection.query('UPDATE `teams` SET `czas` = ? WHERE `teams`.`id_user` LIKE ? AND `teams`.`id_projektu` LIKE ?', [ czas, request.session.id_user, packet[0]], function(error, results, fields){});	
			response.send("Success");
		}
	});
});

// zwraca raporty danego uzytkownika
app.post("/pr_raport", function(request, response){
	connection.query('SELECT * FROM `teams` INNER JOIN projekty ON teams.id_projektu = projekty.id_projektu WHERE teams.id_user LIKE ?', [request.session.id_user], function(error, results, fields)
	{
		if(results.length > 0)
		{
			let data = [];
			for(let i = 0; i < results.length; i++)
			{
				data.push({"id": results[i].id_projektu,"nazwa":results[i].nazwa});
			}
			response.send(data);
		}else
		{
			response.send("NONE");
		}
	});
});

// pracownik - zmiana danych
app.post("/pr_zmien", function(request, response)
{
	let imie = request.body.imie;
	let nazwisko = request.body.nazwisko;
	let haslo = request.body.haslo;
	let phaslo = request.body.rphaslo;

	if(haslo === phaslo)
	{
		if(imie && imie!==request.session.imie)
		{
			connection.query('UPDATE `users` SET `imie` = ? WHERE `users`.`id_user` = ?', [imie, request.session.id_user], function(error, results, fields){});
		}
		if(nazwisko && nazwisko!==request.session.nazwisko)
		{
			connection.query('UPDATE `users` SET `nazwisko` = ? WHERE `users`.`id_user` = ?', [nazwisko, request.session.id_user], function(error, results, fields){});
		}
		if(haslo !== request.session.password)
		{
			connection.query('UPDATE `users` SET `haslo` = ? WHERE `users`.`id_user` = ?', [haslo, request.session.id_user], function(error, results, fields){});
		}

		response.redirect('/ekranpracownika');
		response.end();
	}
	else
	{
		response.redirect("/edytujswojedane");
		response.end();
	}

});

// autoryzacja
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
        connection.query('SELECT * FROM users WHERE login = ? AND haslo = ?', [username, password], function(error, results, fields) 
        {		
			if (results.length > 0) {
				request.session.loggedin = true;		
				request.session.username = username;
				request.session.password = password;
				request.session.id_user = results[0].id_user;
				request.session.imie = results[0].imie;
				request.session.nazwisko = results[0].nazwisko;
				request.session.stanowisko = results[0].stanowisko;
				if(request.session.stanowisko === "Admin"){
					response.redirect('/ekranAdmina');
				}
				else if(request.session.stanowisko === "Kierownik")
				{
					response.redirect('/ekrankierownika');
				}
				else
				{
					response.redirect('/ekranpracownika');
				}
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

app.post('/checklogin', function(request, response)
{
	connection.query('SELECT * FROM users WHERE login = ?', [request.body.login], function(error, results, fields)
	{
		if(results.length === 0){
			response.send("Correct");
		}else{
			response.send("Error");
		}
	});
});

app.post('/rejestruj', function(request, response)
{
	connection.query('INSERT INTO `users` (`id_user`, `imie`, `nazwisko`, `login`, `haslo`, `stanowisko`) VALUES (NULL, ?, ?, ?, ?, ?) ', [request.body.imie, request.body.nazwisko, request.body.login, request.body.haslo, "oczekujący"], function(error, results, fields){});
	response.send("Success");
});


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