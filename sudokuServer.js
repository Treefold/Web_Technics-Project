// node Documents/GitHub/Web_Technics-Project/sudokuServer.js
var http   = require ('http');
var fs     = require ('fs');
var path   = require('path')
var server = http.createServer((function (request,response){
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
            // while(1);
            // console.log (request.rawHeaders[7]);
            var fin = solveSudoku (JSON.parse(request.rawHeaders[7]));
            if (fin != -1) {console.log(fin);console.log();}
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end(JSON.stringify(fin));
        }
        else {console.log ("Undefined method!");}
    }
}));
server.listen(8080);
console.log ('Waiting requests at http://localhost:8080/');

function solveSudoku (boxes) {
    var g_sudokuType, g_SudokuLineSize, g_SudokuZoneSize;

    function zoneOf (i, j) {
        return Math.trunc ((i - 1) / g_SudokuZoneSize) * g_SudokuZoneSize 
             + Math.trunc ((j - 1) / g_SudokuZoneSize) + 1;
    }

    switch (boxes.length) {
        case 3*3: g_SudokuZoneSize = 3; g_sudokuType = "Dec"; break;
        case 4*4: g_SudokuZoneSize = 4; g_sudokuType = "Hex"; break;
        case 2*2: g_SudokuZoneSize = 2; g_sudokuType = "Min"; break;
        default:  console.log ("UNKNOWN TYPE OF SUDOKU!"); return -1;
    }
    g_SudokuLineSize = g_SudokuZoneSize * g_SudokuZoneSize;

    let mat = [];
    let fin = [];
    let tra = {};
    let ok  = 0; 
    let z   = new Array(g_SudokuLineSize + 1).fill(0);

    tra["#"] = 0;
    for (let i = 0; i <= g_SudokuLineSize - (g_sudokuType != "Hex" ? 0 : 1); ++i){
        tra[i.toString(16)] = i + (g_sudokuType != "Hex" ? 0 : 1);
        mat[i] = new Array(g_SudokuLineSize + 1).fill(0);
        fin[i] = [];
    }

    for (let i = 1, j; i <= g_SudokuLineSize; ++i) {
        for (j = 1; j <= g_SudokuLineSize; ++j) {
            console.log(boxes[i - 1][j - 1]);
            mat[i][j] = tra[boxes[i - 1][j - 1]];
            if (mat[i][j] != 0) {
                ++mat[i][0];
                ++mat[0][j];
                ++z[zoneOf(i, j)];
            }
        }
    }

    function sig(){ // select all sure
        let a = b = k = l = i = j = 0, v;
        
        for (i = 1; i <= g_SudokuLineSize; ++i) {
            if (mat[i][0] == g_SudokuLineSize - 1) {
                v = new Array (g_SudokuLineSize + 1).fill(0);
                for (j = 1; j <= g_SudokuLineSize; ++j) {
                    v[mat[i][j]] = 1;            // mark all used numbers
                    if (mat[i][j] == 0) {a = j;} // where is the free spot
                }
                for (j = 1; j <= g_SudokuLineSize; ++j) {
                    if (!v[j]) {       // this number isn't used
                        mat[i][a] = j; // place it in the free spot
                        ++mat[i][0];
                        ++mat[0][a];
                        ++z[zoneOf(i, a)];
                        break; // only one free spot, nothing more to do here
                    }
                }
            }
        }

        for (j = 1; j <= g_SudokuLineSize; ++j) {
            if (mat[0][j] == g_SudokuLineSize - 1) {
                v = new Array(g_SudokuLineSize + 1).fill(0);
                for (i = 1; i <= g_SudokuLineSize; ++i) {
                    ++v[mat[i][j]];              // mark all used numbers
                    if (mat[i][j] == 0) {a = i;} // where is the free spot
                }
                for (i = 1; i <= g_SudokuLineSize; ++i ){
                    if (!v[i]) {       // this number isn't used
                        mat[a][j] = i; // place it in the free spot
                        ++mat[a][0];
                        ++mat[0][j];
                        ++z[zoneOf(a, j)];
                        break; // only one free spot, nothing more to do here
                    }
                }
            }
        }
        if (a != 0) {return sig();} // first fill all the lines and columns

        for (n = 1; n <= g_SudokuLineSize; ++n) {
            if (z[n] == g_SudokuLineSize - 1) {
                v = new Array (g_SudokuLineSize + 1).fill(0);
                i = Math.trunc (n / g_SudokuZoneSize);
                if (n % g_SudokuZoneSize != 0) {++i;}
                j = n - (i - 1) * g_SudokuZoneSize;
                i = (i - 1) * g_SudokuZoneSize + 1;
                j = (j - 1) * g_SudokuZoneSize + 1;
                for (k = i; k < i + g_SudokuZoneSize; ++k) {
                    for (l = j; l < j + g_SudokuZoneSize; ++l) {
                        ++v[mat[k][l]];                     // mark all used numbers
                        if (mat[k][l] == 0) {a = k; b = l;} // where is the free spot
                    }
                }
                for (i = 1; i <= g_SudokuLineSize; ++i){
                    if (!v[i]){    // this number isn't used
                    mat[a][b] = i; // place it in the free spot
                    ++mat[a][0];
                    ++mat[0][b];
                    ++z[zoneOf(a, b)];
                    break; // only one free spot, nothing more to do here
                    }
                }
            }
        }
        if (a != 0) {sig();} // if the a zone was filled, try to fill the line or the column
    }
    sig();
    
    let ln = [];
    let col = [];
    n = 0;
    for (i = 1; i <= g_SudokuLineSize; ++i) {
        for (j = 1; j <= g_SudokuLineSize; ++j) {
            if (mat[i][j] == 0){ ln[++n] = i; col[n] = j;}
        }
    }
    
    function verif (i, j, k){ // checks if k is a correct fit in the mat[i][j]
        let a;
        for (a = 1; a < j; ++a) {
            if (mat[i][a] == k) { return 0;}
        }
        for (a = j + 1; a <= g_SudokuLineSize; ++a) {
            if (mat[i][a] == k) {return 0;}
        }
        for (a = 1; a < i; ++a) {
            if (mat[a][j] == k) {return 0;}
        }
        for (a = i + 1; a <= g_SudokuLineSize; ++a) {
            if (mat[a][j] == k) {return 0;}
        }
        
        function zoneStart (coord) {return Math.trunc((coord - 1) / g_SudokuZoneSize) * g_SudokuZoneSize + 1;}

        i = zoneStart (i);
        j = zoneStart (j);    
        
        for (let a = i , b; a < i + g_SudokuZoneSize ; ++a) {
            for (b = j; b < j + g_SudokuZoneSize; ++b) {
                if (mat[a][b] == k) {return 0;}
            }
        }
        
        return 1;
    }

    function bac (k) {
        if (k == n + 1) {
            ok = 1;
            for (i = 1; i <= g_SudokuLineSize; ++i) {
                for (j = 1; j <= g_SudokuLineSize; ++j) {
                    fin[i-1][j-1] = ((mat[i][j] == 0) ? "# " : (mat[i][j] - (g_sudokuType != "Hex" ? 0 : 1)).toString(16));
                }
            }
            n = 0;
        }
        if (k > n) {return;}

        for (let ii = 1 ; ii <= g_SudokuLineSize && !ok; ++ii){
            if (verif (ln[k], col[k], ii)){
            mat[ln[k]][col[k]] = ii;
            bac(k + 1);
            mat[ln[k]][col[k]] = 0;
            }
        }
    }
    bac(1)
    return (ok == 1) ? fin : -1;
}