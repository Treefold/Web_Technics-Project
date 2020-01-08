// node Documents/GitHub/Web_Technics-Project/sudokuServer.js
var http = require ('http');
var fs   = require ('fs');
var path = require('path');
var server=http.createServer((function (request,response){
    if (request.method == 'GET') {
        fs.readFile(path.join(__dirname, 'sudoku.html'), null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('sudoku.html file not found');
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(data);
            }
            response.end();
        });
    }
    else {
        if (request.method == 'POST') {
            //console.log(request);
            //console.log (JSON.parse(request.data));
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end(JSON.stringify("SERVER"));
        }
        else {console.log ("Undefined method!");}
    }
}));
server.listen(7000);
console.log ('Waiting requests at http://localhost:7000/');