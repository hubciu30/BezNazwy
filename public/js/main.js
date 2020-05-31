function validation()
{
    if(window.location.href.indexOf('.html') > -1)
    {
        window.location = window.location.href.replace('.html','');
    }
}
// sprawdza URL pod katem bezpieczenstwa
validation();


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
    $.post('admin_zmien', packet, function(data) {});
}

function AdminDelete() 
{
    let packet = 
    {
        id : $("#users").val(),
    }
    $.post('admin_usun', packet, function(data) {});
}