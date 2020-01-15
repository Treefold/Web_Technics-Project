// node Documents/GitHub/Web_Technics-Project/sudokuServer.js
var http       = require ('http');
var fs         = require ('fs');
var path       = require('path')
var bodyParser = require('body-parser');
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
            //console.log (request.rawHeaders)
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end(JSON.stringify(solveSudoku(request.rawHeaders[8], JSON.parse(request.rawHeaders[9]))));
        }
        else {console.log ("Undefined method!");}
    }
}));
server.listen(7000);
console.log ('Waiting requests at http://localhost:7000/');

function solveSudoku (g_sudokuType, boxes) {
    var g_SudokuLineSize, g_SudokuZoneSize;
    switch (g_sudokuType) {
      case "Dec": g_SudokuZoneSize = 3; break;
      case "Hex": g_SudokuZoneSize = 4; break;
      case "Min": g_SudokuZoneSize = 2; break;
      default:    console.log ("Create Sudoku ERROR: UNKNOWN TYPE OF SUDOKU!"); return -1;
    }
    g_SudokuLineSize = g_SudokuZoneSize * g_SudokuZoneSize;

    let mat = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]];
    let tra = [0];
    let z = [0]
    tra["#"] = 0;
    for (let i = 0; i <= g_SudokuLineSize; ++i){
        tra[i.toString(16)] = i + (g_sudokuType != "Hex" ? 0 : 1);
        mat[i][0] = mat[0][i] = z[i] = 0;
    }
    for (let i = 1; i <= g_SudokuLineSize; ++i){
      for (let j = 1; j <= g_SudokuLineSize; ++j){
        mat[i][j] = tra[boxes[g_SudokuLineSize * (i - 1) + j - 1]];
        if (mat[i][j]){
          ++mat[i][0];
          ++mat[0][j];
          ++z[zoneOf(i, j)];
        }
      }
    }
    console.log(mat);
    return 0;
    function sig() // select all sure
        {
          let a = b = k = l = i = j = 0;
          
          for (i = 1; i <= g_SudokuLineSize; ++i){
            if (mat[i][0] == g_SudokuLineSize - 1){
              let v = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (j = 1; j <= g_SudokuLineSize; ++j){
                ++v[mat[i][j]];
                if (mat[i][j] == 0){ a = j; j = g_SudokuLineSize + 1;}
              }
              for (j = 1; j <= g_SudokuLineSize; ++j){
                if (!v[j]){
                  mat[i][a] = j;
                  ++mat[i][0];
                  ++mat[0][a];
                  ++z[zoneOf(i, a)];
                  j = g_SudokuLineSize + 1;
                }
              }
            }
          }
          for (j = 1; j <= g_SudokuLineSize; ++j){
            if (mat[0][j] == g_SudokuLineSize - 1){
              let v = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (i = 1; i <= g_SudokuLineSize; ++i){
                ++v[mat[i][j]];
                if (mat[i][j] == 0){ a = i; i = g_SudokuLineSize + 1;}
              }
              for (i = 1; i <= g_SudokuLineSize; ++i ){
                if (!v[i])
                {
                  mat[a][j] = i;
                  ++mat[a][0];
                  ++mat[0][j];
                  ++z[zoneOf(a, j)];
                  i = g_SudokuLineSize + 1;
                }
              }
            }
          }
          if (a != 0){ return sig();}

          for (n = 1; n <= g_SudokuLineSize; ++n){
            if (z[n] == g_SudokuLineSize - 1)
            {
              let v = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              i = Math.trunc(n / g_SudokuZoneSize);
              if (n % g_SudokuZoneSize != 0){ ++i;}
              j = n - (i - 1) * g_SudokuZoneSize;
              i = (i - 1) * g_SudokuZoneSize + 1;
              j = (j - 1) * g_SudokuZoneSize + 1;
              for (k = i; k < i + g_SudokuZoneSize; ++k){
                for (l = j; l < j + g_SudokuZoneSize; ++l){
                  ++v[mat[k][l]];
                  if (mat[k][l] == 0){ a = k; b = l; k = l = g_SudokuLineSize;}
                }
              }
              for (i = 1; i <= g_SudokuLineSize; ++i){
                if (!v[i]){
                  mat[a][b] = i;
                  ++mat[a][0];
                  ++mat[0][b];
                  ++z[zoneOf(a, b)];
                  break;
                }
              }
            }
          }
          if (a != 0){ sig();}
        }
        sig();
        
        let ln = [];
        let col = [];
        n = 0;
        for (i = 1; i <= g_SudokuLineSize; ++i){
            for (j = 1; j <= g_SudokuLineSize; ++j){
                if (mat[i][j] == 0){ ln[++n] = i; col[n] = j;}
            }
        }
        
        function verif (i, j, k){
          let a;
          for (a = 1; a < j; ++a){
              if (mat[i][a] == k){ return 0;}
          }
          for (a = j + 1; a <= g_SudokuLineSize; ++a){
              if (mat[i][a] == k){ return 0;}
          }
          for (a = 1; a < i; ++a){
              if (mat[a][j] == k){ return 0;}
          }
          for (a = i + 1; a <= g_SudokuLineSize; ++a){
              if (mat[a][j] == k){ return 0;}
          }
          
          function zoneStart (coord) {return Math.trunc((coord - 1) / g_SudokuZoneSize) * g_SudokuZoneSize + 1;}

          i = zoneStart(i);
          j = zoneStart(j);    
          
          let nr = 0;
          for (let a = i ; a < i + g_SudokuZoneSize ; ++a){
              for (let b = j; b < j + g_SudokuZoneSize; ++b){
                  if (mat[a][b] == k){ ++nr;}
              }
          }
          
          return nr == 0;
        }
        
        function bac (k){
          if (k == n + 1){
            for (i = 1; i <= g_SudokuLineSize; ++i){
              for (j = 1; j <= g_SudokuLineSize; ++j){
                boxes[g_SudokuLineSize * (i - 1) + j - 1].innerHTML =
                ((mat[i][j] == 0) ? "# " : (mat[i][j] - (g_sudokuType != "Hex" ? 0 : 1)).toString(16) + " ");
              }
            }
            n = 0;
          }
          if (k > n) {return;}

          for (let ii = 1 ; ii <= g_SudokuLineSize && !emergencyStopped; ++ii){
            if (verif (ln[k], col[k], ii)){
              mat[ln[k]][col[k]] = ii;
              bac(k + 1);
              mat[ln[k]][col[k]] = 0;
            }
          }
        }
    console.log(mat);
    return mat;
}