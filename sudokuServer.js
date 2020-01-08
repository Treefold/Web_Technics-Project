var http=require('http') 
var server=http.createServer((function (request,response){
    response.writeHead(200,{"Content-Type":"text\plain"});
    if(request.method == "GET")
        {
            response.end("received GET request.")
        }
    else if(request.method == "POST")
        {
            response.end("received POST request.");
        }
    else
        {
            response.end("Undefined request .");
        }
    //console.log(JSON.parse(request));
    response.end();
}));
server.listen(7000); // serverul este pornit si asculta cereri la portul 7000 al masinii locale
console.log ('Serverul creat asteapta cereri la http://localhost:7000/');