(function () {
  //create Sudoku game table
  let body = document.body;
  body.style.backgroundColor = "#ccffff";
  let tableSudoku = document.createElement ('table');
  tableSudoku.id = "Sudoku";
  body.appendChild (tableSudoku);

  //Instructions
  body.appendChild (document.createElement ('br'));
  let instructions = document.createElement ('h3');
  instructions.innerHTML = "Chose one number from below and click where \nit should be in the Sudoku you want to solve";
  body.appendChild (instructions);
  
  //create Sudoku choices' list
  let tableOfChoices = document.createElement ('table');
  tableOfChoices.id = "SudokuChoices";
  body.appendChild (tableOfChoices);
  
  //Restart button = Clear Sudoku
  body.appendChild (document.createElement ('br'));
  let restartb = document.createElement ('button');
  restartb.style.backgroundColor = 'yellow';
  restartb.addEventListener ("click", clear);
  restartb.innerHTML = "Clear Sudoku";
  restartb.appendChild (document.createTextNode('\u0020'));
  body.appendChild (restartb);
  
  //Solve button
  let solveb = document.createElement('button');
  solveb.style.backgroundColor = 'yellow';
  solveb.addEventListener("click", solve);
  solveb.innerHTML = "Solve Sudoku";
  solveb.appendChild(document.createTextNode('\u0020'));
  body.appendChild(solveb);
  
  //min sudoku button
  let minb = document.createElement('button');
  minb.style.backgroundColor = 'yellow';
  minb.addEventListener("click",  function(){deleteAll();createSudoku("Min");});
  minb.innerHTML = "new Min Sudoku";
  minb.appendChild(document.createTextNode('\u0020'));
  body.appendChild(minb);

  //decimal sudoku button
  let decb = document.createElement('button');
  decb.style.backgroundColor = 'yellow';
  decb.addEventListener("click", function(){deleteAll();createSudoku("Dec");});
  decb.innerHTML = "new Dec Sudoku";
  decb.appendChild(document.createTextNode('\u0020'));
  body.appendChild(decb);
  
  //hex button
  let deleteAllb = document.createElement('button');
  deleteAllb.style.backgroundColor = 'yellow';
  deleteAllb.addEventListener("click", function(){deleteAll();createSudoku("Hex");});
  deleteAllb.innerHTML = "new Hex Sudoku";
  deleteAllb.appendChild(document.createTextNode('\u0020'));
  body.appendChild(deleteAllb);
  
  // // Delete button
  // let deleteAllb = document.createElement('button');
  // deleteAllb.style.backgroundColor = 'yellow';
  // deleteAllb.addEventListener("click", deleteAll);
  // deleteAllb.innerHTML = "Delete All";
  // deleteAllb.appendChild(document.createTextNode('\u0020'));
  // body.appendChild(deleteAllb);

  createSudoku("Dec");
}  
)();

var g_SudokuZoneSize, g_SudokuLineSize, g_sudokuType;

function createSudoku (type = "Dec") {

  switch (type) {
    case "Dec": g_SudokuZoneSize = 3; break;
    case "Hex": g_SudokuZoneSize = 4; break;
    case "Min": g_SudokuZoneSize = 2; break;
    default:    console.log ("Create Sudoku ERROR: UNKNOWN TYPE OF SUDOKU!"); return;
  }

  g_sudokuType = type;

  g_SudokuLineSize = g_SudokuZoneSize * g_SudokuZoneSize;

  let tableSudoku = document.getElementById ('Sudoku');
  for (let i = 1; i <= g_SudokuLineSize; ++i) {
    let tr = document.createElement('tr');
    tr.id = "line" + String(i);
    for (let j = 1; j <= g_SudokuLineSize; ++j) {
      let td = document.createElement('td');
      let button = document.createElement('button');
      button.classList.add("box");
      button.style.backgroundColor = 'yellow';
      button.style.textAlign = "center";
      button.classList.add("zona" + String(zoneOf(i, j)));
      button.classList.add("line" + String(i));
      button.classList.add("col" + String(j));
      button.id = "box" + String(zoneOf(i, j)) + "-" + String(i) + "-" + String(j);
      button.addEventListener("click", function(){selectBox(this);});
      button.innerHTML = "#";
      button.appendChild(document.createTextNode('\u0020'));
      td.appendChild(button);
      tr.appendChild(td);
      if (j % g_SudokuZoneSize == 0 && j != g_SudokuLineSize){
        let tdb = document.createElement('td');
        tdb.style.textAlign = "center";
        tdb.innerHTML = "|";
        tdb.appendChild(document.createTextNode('\u0020'));
        tr.appendChild(tdb);
      }
    }
    
    tableSudoku.appendChild(tr);
    if (i % g_SudokuZoneSize == 0 && i != g_SudokuLineSize){
      let trb = document.createElement('tr');
      for (let j = 1; j < g_SudokuZoneSize * (g_SudokuZoneSize + 1); ++j) {
        let tdb = document.createElement('td');
        tdb.style.textAlign = "center";
        tdb.innerHTML = (j % (g_SudokuZoneSize + 1) == 0) ? "+" : "---";
        tdb.appendChild(document.createTextNode('\u0020'));
        trb.appendChild(tdb);
      }
      tableSudoku.appendChild(trb);
    }
  }
  
  let listChoice = document.createElement('tr');
  let last = g_SudokuLineSize + ((type != "Hex") ? 1 : 0);
  for (i = (type == "Hex") ? 0 : 1; i <= last; ++i){
    let choicePlace = document.createElement('td');
    let choice = document.createElement('button');
    choice.style.textAlign = "center";
    choice.classList.add("choice");
    choice.style.backgroundColor = 'yellow';
    choice.id = choice.innerHTML = (i != last) ? i.toString(16) : "Delete";
    choice.addEventListener("click", function(){selectChoice(this);});
    choice.appendChild(document.createTextNode('\u0020'));
    choicePlace.appendChild(choice);
    listChoice.appendChild(choicePlace);
  }
  document.getElementById ("SudokuChoices").appendChild(listChoice);
}

function zoneOf (i, j){
  return Math.trunc((i - 1) / g_SudokuZoneSize) * g_SudokuZoneSize 
       + Math.trunc((j - 1) / g_SudokuZoneSize) + 1;
}



function deleteRec (obj) {
  while (obj.childNodes.length > 0) {
    deleteRec (obj.firstChild);
    obj.removeChild (obj.firstChild);
  }
}

function deleteAll() {
  for (let table of document.querySelectorAll("#Sudoku, #SudokuChoices")) {
    deleteRec (table)
  }
}

function clear(){
  let choises = document.getElementsByClassName("choice");
  for (let i = 0; i < g_SudokuLineSize; ++i){
    choises[i].style.backgroundColor = 'yellow';
  }
  let boxes = document.getElementsByClassName("box");
  for (let i = 0; i < g_SudokuLineSize * g_SudokuLineSize; ++i){
    boxes[i].style.backgroundColor = 'yellow';
    boxes[i].innerHTML = '#';
  }
}

function selectChoice (choice){
  // if a choice is selected => deselect it
  if (choice.style.backgroundColor == 'green'){
    choice.style.backgroundColor = 'yellow';
    return;
  }
  // deselect all selecte choises
  let listChoice = document.getElementsByClassName('choice');
  for (i = 0; i <= g_SudokuLineSize; ++i){
    listChoice[i].style.backgroundColor = 'yellow';
  }
  choice.style.backgroundColor = 'green'; // select your actual choice
}

function testBox (box, choice){ //test if the choice fits in the box
  //box.class[]: "box", "zonaZ", "lineL", "colC"
  
  //test zone
  let zone = document.getElementsByClassName(box.classList[1]);
  for( i in zone){
    if (zone[i].innerHTML === choice.innerHTML){ return false;}
  }
  //test line
  let line = document.getElementsByClassName(box.classList[2]);
  for( i in line){
    if (line[i].innerHTML === choice.innerHTML){ return false;}
  }
  //test col
  let col = document.getElementsByClassName(box.classList[3]);
  for( i in col){
    if (col[i].innerHTML === choice.innerHTML){ return false;}
  }
  //all tests passed
  return true;
}

function selectBox (box) {
  let listChoice = document.getElementsByClassName('choice');
  let noChoice = true; //we start by believing there is no choice selected
  let choice;
  // testing my theory
  for (let i = 0; i <= g_SudokuLineSize && noChoice; ++i){
    if (listChoice[i].style.backgroundColor === 'green'){
      noChoice = false;
      choice = listChoice[i];
    }
  }
  if (noChoice){return;} // no choice selected => no action needed
  if (box.innerHTML === choice.innerHTML){return;} // same number => wish granted already => no action needed
  if (choice.id == "Delete"){ box.innerHTML = "#"; return;} //just delete the curent number from the box
  if (testBox (box, choice)){ //test if the choice fits in the box
    box.innerHTML = choice.innerHTML; //as the master wishes
  }
}

function solve(){
  let startSolve = new Date();
  var mat = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]];
  var tra = [0];
  var z = [0]
  tra["# "] = tra["#"] = 0;
  for (var i = 0; i <= g_SudokuLineSize; ++i){
    tra[i.toString(16) + " "] = i + (g_sudokuType != "Hex" ? 0 : 1);
    mat[i][0] = mat[0][i] = z[i] = 0;
  }
  var boxes = document.getElementsByClassName("box");
  for (var i = 1; i <= g_SudokuLineSize; ++i){
    for (var j = 1; j <= g_SudokuLineSize; ++j){
      mat[i][j] = tra[boxes[g_SudokuLineSize * (i - 1) + j - 1].innerHTML];
      if (mat[i][j]){
        ++mat[i][0];
        ++mat[0][j];
        ++z[zoneOf(i, j)];
      }
    }
  }
  
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
        var v = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
  
  var ln = [];
  var col = [];
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
    if (k > n){return;}

    for (let ii = 1 ; ii <= g_SudokuLineSize; ++ii){
      if (verif (ln[k], col[k], ii)){
        mat[ln[k]][col[k]] = ii;
        bac(k + 1);
        mat[ln[k]][col[k]] = 0;
      }
    }
  }
  bac(1); 
  let finSolve = new Date();
  alert (finSolve - startSolve);
  if (n != 0) {alert("Impossible to Solve!");} 
}