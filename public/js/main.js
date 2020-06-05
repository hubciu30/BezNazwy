function validation()
{
    if(window.location.href.indexOf('.html') > -1)
    {
        window.location = window.location.href.replace('.html','');
    }
}
// sprawdza URL pod katem bezpieczenstwa
validation();

// Wypisanie Imienia i nazwiska zalogowanej osoby
function WhoIAm()
{
    $.post('PracownikDane', function(data){
        $("#userLog").children()[0].innerText = data.imie + " " + data.nazwisko;
    });
}
WhoIAm(); // wywołanie

// Wyloguj
function LogOut()
{
    $("#btnLogOut").on("click", function(){
        $.post('logout', function(data){
            if(data === "OK")
            {
                location.reload();
            }else{
                alert("Error");
            }
        });
        
    });
}
LogOut();

// pracownik - raporty
function ProjektyPracownika()
{
    $.post("/pr_raport", function(data)
    {
        if(data === "NONE")
        {
            $("#projektSelect").append("<option>Nie jesteś przypisany do żadnego projektu!</option>")
            
        }else
        {
            for(let i = 0; i < data.length; i++)
            {
                $("#projektSelect").append("<option value = "+data[i].id+">"+data[i].nazwa+"</option>");
            }
        }
    });
}

// wyswietla szczegoly na temat danego projektu dla konkretnego usera
function ShowProjectThisUser()
{
    let id = $("#projektSelect").val();
    let packet = {projektID : id};
    $.post("pr_getraportperprojekt", packet, function(data){
        let div = $("#userRaporty");
        div.empty();
        let table = document.createElement('table');
        table.id = "prTable";
        table.className = "table";
        div.append(table);

        let title = document.createElement('tr');
        title.id = "prTable_title";
        $("#prTable").append(title);

        const names = ["Data", "Godziny", "Opis"];
        // naglowek
        for (let i = 0; i < names.length; i++) {
            let temp = document.createElement('th');
            temp.innerText = names[i];
            title.append(temp);
        }
        // dane
        for (let row = 0; row < data.length; row++) {
            let tr = document.createElement('tr');
            $("#prTable").append(tr);
    
            for (let col = 0; col < names.length; col++) {
                let td = document.createElement('td');
                let msg = "";
                if(col === 0) msg = data[row].data;
                else if(col === 1) msg = data[row].czas;
                else msg = data[row].opis;
                $('<p>'+ msg +'</p>').appendTo(td);
                tr.append(td);
            }

        }
        $("#prTable").css("text-align", "center");
        $("#prTable").css("margin", "10px");
        $("#prTable").css("width", "30%");
    });
}

// wysyla raport oraz dodaje pracownikowi czas przy projekcie
function PracownikWysylaRaport()
{
    let packet = 
    {
        "pojekt_id" : $("#projektSelect").val(),
        "godziny" : $("#liczbagodzin").val(),
        "data" : $("#data").val(),
        "opis" : $("#opis").val()
    }

    $.post("/pr_sendRaport", packet, function(data)
    {
        if(data === "Success")
        {
            alert("Wysłano raport!");
        }else
        {
            alert("Wystąpił problem!");
        }
    });

    return false;
}

// rejestracja
function Rejestracja()
{
    let haslo = $("#haslo").val();
    let phaslo = $("#phaslo").val();
    if(haslo && phaslo && haslo === phaslo)
    {
        $("#haslo").css("border-color","green");
        $("#phaslo").css("border-color","green");
        $.post('checklogin',{login: $("#login").val()}, function(data){
            console.log(data);
            if(data === "Correct")
            {
                $("#login").css("border-color","green");
                $.post('rejestruj',
                {
                    login: $("#login").val(),
                    haslo: $("#haslo").val(),
                    imie: $("#imie").val(),
                    nazwisko: $("#nazwisko").val()
                }, function(data){
                    if(data === "Success")
                    {
                        window.location = "logowanie";
                    }
                    else
                    {
                        alert("Wystąpił problem!");
                    }                  
                });
            }else
            {
                $("#login").css("border-color","red");
            }
        });
    }else
    {
        $("#haslo").css("border-color","red");
        $("#phaslo").css("border-color","red");
    }
}

//admin - all users
function GetAllUsers()
{
    if(window.location.href.indexOf("uprawnienia") > -1 || window.location.href.indexOf("edytujDaneUseraPrzezAdmina") > -1 )
    { 
        $.post("admin_getUsers", function(data)
        {
            for(let i = 0; i < data.length; i++)
            {
                $("#users").append("<option value="+data[i].id+">"+data[i].imie + " " +data[i].nazwisko+ "  ("+data[i].stanowisko+")</option>")
            }
        });
    }
    else
    {
        return false;
    }
}
// admin - zmiana uprawnien
function ZmienUprawnienia()
{
    if(window.location.href.indexOf("uprawnienia") > -1)
    {        
        $.post("admin_Permission",{idd: $("#users").val(), job: $("#job").val()}, function(data)
        {
            if(data === "Success")
            {
                window.location.reload();
            }else
            {
                alert("Wystąpił błąd!");
            }
        });
    }
}

function AdminChangeData() 
{
    let packet = 
    {
        id : $("#users").val(),
        imie : $("#imie").val(),
        nazwisko : $("#nazwisko").val(),
        login : $("#login").val(),
        haslo : $("#haslo").val(),
        phaslo : $("#phaslo").val()
    }
    $.post('admin_zmien', packet, function(data) {
        if(data === "Success")
        {
            alert("Zaktualizowano dane!");
        }else{alert("Error");}
    });
}

function AdminDelete() 
{
    let packet = 
    {
        id : $("#users").val(),
    }
    $.post('admin_usun', packet, function(data) {});
}

function DezaktywujProjekt()
{
    let packet = {id : $("#projekty").val()};
    $.post('admin_dezaktywujPojekt', packet, function(data){
        if(data === "OK")
        {
            alert("Projekt został dezaktywowany");
            location.reload();
        }
        else 
        {
            alert("Wystąpił nieoczekiwany błąd!");
        }
    });
}

function AktywneProjekty()
{
    $.post('admin_aktywneProjekty', function(data){
        for(let i = 0; i < data.length; i++)
        {
            $("#projekty").append("<option value = "+data[i].id+">"+data[i].nazwa+"</option>");
        }
    });
}

function ShowMoreForProject()
{
    $.post("kr_thisprojekt", function(data){
        $("#projekt_name").text(data[0].nazwa);
        let title = document.createElement('tr');
        title.id = "prTable_title";
        $("#tabela").append(title);

        const names = ["Pracownik", "Godziny", "Opis"];
        // naglowek
        for (let i = 0; i < names.length; i++) {
            let temp = document.createElement('th');
            temp.innerText = names[i];
            title.append(temp);
        }
        // dane
        for (let row = 0; row < data.length; row++) {
            let tr = document.createElement('tr');
            $("#tabela").append(tr);
    
            for (let col = 0; col < names.length; col++) {
                let td = document.createElement('td');
                let msg = "";
                if(col === 0) 
                {
                    msg = data[row].imie + " " + data[row].nazwisko;
                    $('<p>'+ msg +'</p>').appendTo(td);
                }
                else if(col === 1) 
                {
                    msg = data[row].czas;
                    $('<p>'+ msg +'</p>').appendTo(td);
                }
                else
                {
                    $("<button/>",
                    {
                        id: data[row].id,
                        class: "btn btn-primary",
                        text: 'Opis',
                        onclick: "TakePerson("+data[row].id+");"
                    }).appendTo(td);
                    
                }
                tr.append(td);
            }
        }
    });
}