function validation()
{
    if(window.location.href.indexOf('.html') > -1)
    {
        window.location = window.location.href.replace('.html','');
    }
}
// sprawdza URL pod katem bezpieczenstwa
validation();