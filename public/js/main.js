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