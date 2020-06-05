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
	password : '',
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

app.get('/raportPracownika', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/raportPracownika.html");
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

//// Przejscie do ekranu dodaj projekt
app.get('/nowyProjekt', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/nowyProjekt.html");
	}	
});
////

//// Przejscie do ekranu dodaj uzytkownika
app.get('/dodajUzytkownika', function(request, response) {
	if(isLogged(request, response))
	{
		response.sendFile(__dirname + "/public/dodajUzytkownika.html");
	}	
});


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
//kierownik

app.post('/kr_showWorker', function(request, response){
	connection.query('SELECT * FROM `raporty` WHERE id_user LIKE ?  AND id_projektu LIKE ?', [request.session.TEMP_pracownikID, request.session.TEMP_projektID], function(error, results, fields){
		let packet = [];
		if(results.length > 0){
			for(let i = 0; i < results.length; i++)
			{
				let temp = 
				{
					id: results[i].id_user,
					data : results[i].data,
					opis : results[i].opis,
					czas: results[i].czas,
					nazwa: request.session.TEMP_projektNAME
				};
				packet.push(temp);
			}
			response.send(packet);
		}else
		{
			response.send({nazwa: request.session.TEMP_projektNAME});
		}
	});
});


// zachowuje pracownika ktory nas interesuje
app.post('/kr_saveworker', function(request, response)
{
	request.session.TEMP_pracownikID = request.body.id;
	response.send("OK");
});

// wyswietla ogolne dane na temat projektu
app.post("/kr_thisprojekt", function(request, response){ 
	connection.query('SELECT `users`.id_user, imie, nazwisko, czas FROM `users` INNER JOIN `teams` on `users`.`id_user` = `teams`.`id_user` WHERE `teams`.`id_projektu` LIKE ?', [request.session.TEMP_projektID], function(error, results, fields){
		let packet = [];
		for(let i = 0; i < results.length; i++)
		{
			let temp = 
			{
				id: results[i].id_user,
				imie : results[i].imie,
				nazwisko : results[i].nazwisko,
				czas: results[i].czas,
				nazwa: request.session.TEMP_projektNAME
			};
			packet.push(temp);
		}
		response.send(packet);
	});
});
// zachowuje wybrany projekt przez kierownika
app.post("/kr_getprojekt", function(request, response){
	request.session.TEMP_projektID = request.body.id;
	request.session.TEMP_projektNAME = request.body.nazwa;
	response.send("OK");
});

//admin
// zmiana danych usera przez admina - pobranie danych uzytkownika
app.post("/GetDataForUserByID", function(request, response)
{
	let id = request.body.id;
	connection.query("SELECT * FROM `users` WHERE id_user LIKE ?", [id], function(error, results, fields){
		if(results.length === 1)
		{
			let packet = 
			{
				imie : results[0].imie,
				nazwisko : results[0].nazwisko,
				login : results[0].login,
				haslo : results[0].haslo
			}
			response.send(packet);
		}
	});
});

// admin dodaje projekt do realizacji
app.post("/DodajProjekt", function(request, response)
{
	let name = request.body.nazwa;
	connection.query("SELECT * FROM `projekty` WHERE nazwa LIKE ?", [name], function(error, results, fields){
		if(results.length === 0)
		{
			 
			connection.query("INSERT INTO `projekty` (`id_projektu`, `nazwa`, `stan`) VALUES (NULL, ?, '1')", [name], function(error, results, fields)
			{
				if(error !== null)
				{
					response.send("Error");
				}
			});
			response.send("Success");
		}else
		{
			response.send("Error");
		}
	});
});

// admin rejestruj
app.post('/rejestruj', function(request, response)
{
	connection.query('INSERT INTO `users` (`id_user`, `imie`, `nazwisko`, `login`, `haslo`, `stanowisko`) VALUES (NULL, ?, ?, ?, ?, ?) ', [request.body.imie, request.body.nazwisko, request.body.login, request.body.haslo, "oczekujący"], function(error, results, fields){});
	response.send("Success");
});

// admin dezaktywuje konto
app.post("/admin_usun", function(request, response)
{
	let id = request.body.id;
	connection.query('UPDATE `users` SET `stan` = "0" WHERE `users`.`id_user` = ?',[id], function(error, results, fields){});
	response.redirect('/edytujDaneUseraPrzezAdmina');
});

// admin bierze wszystkie aktywne projekty
app.post("/admin_aktywneProjekty", function(request, response){
	
	connection.query('SELECT * FROM `projekty` WHERE stan LIKE 1', function(error, results, fields){
		let packet = [];
		for(let i = 0; i < results.length; i++)
		{
			let temp = 
			{
				id: results[i].id_projektu,
				nazwa: results[i].nazwa
			};
			packet.push(temp);
		}
		response.send(packet);
	});
	
});

// admin dezaktywuje projekt
app.post("/admin_dezaktywujPojekt", function(request, response)
{
	let id = request.body.id;
	connection.query('UPDATE `projekty` SET `stan` = "0" WHERE `projekty`.`id_projektu` = ?',[id], function(error, results, fields){
		if(error !== null)
		{
			response.send("Error")
		}
	});
	response.send("OK");
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
		response.send("Success");
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

// pracownik pobiera raporty per projekt
app.post('/pr_getraportperprojekt', function(request, response){
	connection.query('SELECT * FROM `raporty` WHERE id_user LIKE ? AND id_projektu LIKE ? ', [request.session.id_user, request.body.projektID], function(error, results, fields)
	{
		let packet = [];
		for(let i = 0; i < results.length; i++)
		{
			let temp = 
			{
				data : results[i].data,
				czas : results[i].czas,
				opis : results[i].opis
			}
			packet.push(temp);
		}
		response.send(packet);
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
	connection.query('INSERT INTO `raporty` (`id_raportu`, `id_projektu`, `data`, `opis`, `czas`, `id_user`) VALUES (NULL, ?, ?, ?, ?, ?) ', [packet[0], packet[2], packet[3], packet[1], request.session.id_user], function(error, results, fields){});
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
	connection.query('SELECT * FROM `teams` INNER JOIN projekty ON teams.id_projektu = projekty.id_projektu WHERE teams.id_user LIKE ? AND projekty.stan LIKE 1', [request.session.id_user], function(error, results, fields)
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
	console.log(request.body);
	let imie = request.body.imie;
	let nazwisko = request.body.nazwisko;
	let haslo = request.body.haslo;
	let phaslo = request.body.phaslo;
	if(haslo === phaslo)
	{
		if(imie && imie!==request.session.imie)
		{
			connection.query('UPDATE `users` SET `imie` = ? WHERE `users`.`id_user` = ?', [imie, request.session.id_user], function(error, results, fields){
				if(error!==null)
				{
					response.send('Error');
				}
			});
		}
		if(nazwisko && nazwisko!==request.session.nazwisko)
		{
			connection.query('UPDATE `users` SET `nazwisko` = ? WHERE `users`.`id_user` = ?', [nazwisko, request.session.id_user], function(error, results, fields){
				if(error!==null)
				{
					response.send('Error');
				}
			});
		}
		if(haslo !== request.session.password)
		{
			connection.query('UPDATE `users` SET `haslo` = ? WHERE `users`.`id_user` = ?', [haslo, request.session.id_user], function(error, results, fields){
				if(error!==null)
				{
					response.send('Error');
				}
			});
		}

		response.send('Success');
		response.end();
	}
	else
	{
		response.send("BadPassword");
		response.end();
	}

});

// pobiera imie, nazwisko zalogowanej osoby
app.post('/PracownikDane', function(request, response){
	connection.query('SELECT * FROM users WHERE id_user = ?', [request.session.id_user], function(error, results, fields)
	{
		if(results.length === 1){
			let packet = {imie: results[0].imie, nazwisko: results[0].nazwisko };
			response.send(packet);
		}else{
			response.send("Error");
		}
	});
});


// autoryzacja
app.post('/auth', function(request, response) {
	var username = request.body.login;
	var password = request.body.haslo;
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
				request.session.stan = results[0].stan;

				if(request.session.stan === "1")
				{
					if(request.session.stanowisko === "Admin"){
						//response.redirect('/ekranAdmina');
						response.send("admin");
					}
					else if(request.session.stanowisko === "Kierownik")
					{
						//response.redirect('/ekrankierownika');
						response.send("kierownik");
					}
					else
					{
						//response.redirect('/ekranpracownika');
						response.send("pracownik");
					}
				}
				else
				{
					response.send("nieaktywny")
				}
				
			} else {
				response.send('bad');
			}			
			response.end();
		});
	} else {
		response.send('none');
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


app.post('/logout', function(request, response){
	request.session.destroy();
	response.send("OK");
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