(function () {
  //create Sudoku game table
  var body = document.body;
  body.style.backgroundColor = "#ccffff";
  var tableSudoku = document.createElement ('table');
  tableSudoku.id = "Sudoku";
  body.appendChild (tableSudoku);

  //Instructions
  body.appendChild (document.createElement ('br'));
  var instructions = document.createElement ('h3');
  instructions.innerHTML = "Chose one number from below and click where \nit should be in the Sudoku you want to solve";
  body.appendChild (instructions);
  
  //create Sudoku choices' list
  var tableOfChoices = document.createElement ('table');
  tableOfChoices.id = "SudokuChoices";
  body.appendChild (tableOfChoices);
  
  //Restart button = Clear Sudoku
  body.appendChild (document.createElement ('br'));
  var restartb = document.createElement ('button');
  restartb.style.backgroundColor = 'yellow';
  restartb.addEventListener ("click", clear);
  restartb.innerHTML = "Clear Sudoku";
  restartb.appendChild (document.createTextNode('\u0020'));
  body.appendChild (restartb);
  
  //Solve button
  var solveb = document.createElement('button');
  solveb.style.backgroundColor = 'yellow';
  solveb.addEventListener("click", solve);
  solveb.innerHTML = "Solve Sudoku";
  solveb.appendChild(document.createTextNode('\u0020'));
  body.appendChild(solveb);
  
  //min sudoku button
  var minb = document.createElement('button');
  minb.style.backgroundColor = 'yellow';
  minb.addEventListener("click",  function(){deleteAll();createSudoku("Min");});
  minb.innerHTML = "min Sudoku";
  minb.appendChild(document.createTextNode('\u0020'));
  body.appendChild(minb);

  //decimal sudoku button
  var decb = document.createElement('button');
  decb.style.backgroundColor = 'yellow';
  decb.addEventListener("click", function(){deleteAll();createSudoku("Dec");});
  decb.innerHTML = "dec Sudoku";
  decb.appendChild(document.createTextNode('\u0020'));
  body.appendChild(decb);
  
  //hex button
  var deleteAllb = document.createElement('button');
  deleteAllb.style.backgroundColor = 'yellow';
  deleteAllb.addEventListener("click", function(){deleteAll();createSudoku("Hex");});
  deleteAllb.innerHTML = "hex Sudoku";
  deleteAllb.appendChild(document.createTextNode('\u0020'));
  body.appendChild(deleteAllb);
  
  // // Delete button
  // var deleteAllb = document.createElement('button');
  // deleteAllb.style.backgroundColor = 'yellow';
  // deleteAllb.addEventListener("click", deleteAll);
  // deleteAllb.innerHTML = "Delete All";
  // deleteAllb.appendChild(document.createTextNode('\u0020'));
  // body.appendChild(deleteAllb);

  createSudoku("Dec");
}  
)();

var g_SudokuZoneSize, g_SudokuLineSize;

function createSudoku (type = "Dec") {

  switch (type) {
    case "Dec": g_SudokuZoneSize = 3; break;
    case "Hex": g_SudokuZoneSize = 4; break;
    case "Min": g_SudokuZoneSize = 2; break;
    default:    console.log ("Create Sudoku ERROR: UNKNOWN TYPE OF SUDOKU!"); return;
  }

  g_SudokuLineSize = g_SudokuZoneSize * g_SudokuZoneSize;

  var tableSudoku = document.getElementById ('Sudoku');
  for (var i = 1; i <= g_SudokuLineSize; ++i) {
    var tr = document.createElement('tr');
    tr.id = "line" + String(i);
    for (var j = 1; j <= g_SudokuLineSize; ++j) {
      var td = document.createElement('td');
      var button = document.createElement('button');
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
        var tdb = document.createElement('td');
        tdb.style.textAlign = "center";
        tdb.innerHTML = "|";
        tdb.appendChild(document.createTextNode('\u0020'));
        tr.appendChild(tdb);
      }
    }
    
    tableSudoku.appendChild(tr);
    if (i % g_SudokuZoneSize == 0 && i != g_SudokuLineSize){
      var trb = document.createElement('tr');
      for (var j = 1; j < g_SudokuZoneSize * (g_SudokuZoneSize + 1); ++j) {
        var tdb = document.createElement('td');
        tdb.style.textAlign = "center";
        tdb.innerHTML = (j % (g_SudokuZoneSize + 1) == 0) ? "+" : "---";
        tdb.appendChild(document.createTextNode('\u0020'));
        trb.appendChild(tdb);
      }
      tableSudoku.appendChild(trb);
    }
  }
  
  var listChoice = document.createElement('tr');
  var last = g_SudokuLineSize + 1;
  for (i = 1; i <= last; ++i){
    var choicePlace = document.createElement('td');
    var choice = document.createElement('button');
    choice.style.textAlign = "center";
    choice.classList.add("choice");
    choice.style.backgroundColor = 'yellow';
    choice.id = choice.innerHTML = (i != last) ? String(i) : "Delete";
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

function deleteAll() {
  for (var del of document.querySelectorAll("#Sudoku td, #SudokuChoices td, #Sudoku tr, #SudokuChoices tr")) {
    del.remove (del.firstChild);
  }
}

function clear(){
  var choises = document.getElementsByClassName("choice");
  for (var i = 0; i < g_SudokuLineSize; ++i){
    choises[i].style.backgroundColor = 'yellow';
  }
  var boxes = document.getElementsByClassName("box");
  for (var i = 0; i < g_SudokuLineSize * g_SudokuLineSize; ++i){
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
  var listChoice = document.getElementsByClassName('choice');
  for (i = 0; i <= g_SudokuLineSize; ++i){
    listChoice[i].style.backgroundColor = 'yellow';
  }
  choice.style.backgroundColor = 'green'; // select your actual choice
}

function testBox (box, choice){ //test if the choice fits in the box
  //box.class[]: "box", "zonaZ", "lineL", "colC"
  
  //test zone
  var zone = document.getElementsByClassName(box.classList[1]);
  for( i in zone){
    if (zone[i].innerHTML === choice.innerHTML){ return false;}
  }
  //test line
  var line = document.getElementsByClassName(box.classList[2]);
  for( i in line){
    if (line[i].innerHTML === choice.innerHTML){ return false;}
  }
  //test col
  var col = document.getElementsByClassName(box.classList[3]);
  for( i in col){
    if (col[i].innerHTML === choice.innerHTML){ return false;}
  }
  //all tests passed
  return true;
}

function selectBox (box){
  var listChoice = document.getElementsByClassName('choice');
  var noChoice = true; //we start by believing there is no choice selected
  // testing my theory
  for (var i = 0; i <= g_SudokuLineSize && noChoice; ++i){
    if (listChoice[i].style.backgroundColor === 'green'){
      noChoice = false;
      var choice = listChoice[i];
    }
  }
  if (noChoice){return;} //no choice selected => no action needed
  if (box.innerHTML === choice.innerHTML){return;} // same number => wish granted already => no action needed
  if (choice.id == "Delete"){ box.innerHTML = "#"; return;} //just delete the curent number from the box
  if (testBox (box, choice)){ //test if the choice fits in the box
    box.innerHTML = choice.innerHTML; //as the master wishes
  }
}

function solve(){
  var mat = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]];
  var tra = [0];
  var z = [0]
  for (var i = 0; i <= g_SudokuLineSize; ++i){
    tra[String(i) + " "] = i;
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
    var a = 0;
    var b = 0;
    var k = 0;
    var l = 0;
    var i = 0;
    var j = 0;
    
    for (i = 1; i < g_SudokuLineSize; ++i){
      if (mat[i][0] == g_SudokuLineSize - 1){
        var v = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (j = 1; j <- g_SudokuLineSize; ++j){
          ++v[mat[i][j]];
          if (mat[i][j] == 0){ a = j; j = g_SudokuLineSize + 1;}
        }
        for (j = 1; j <= g_SudokuLineSize; ++j){
          if (!v[j]){
            mat[i][a] = j;
            ++mat[i][0];
            ++mat[0][a];
            ++z[zoneOf(i, a)];
            j = g_SudokuLineSize;
          }
        }
      }
    }
    for (j = 1; j <= g_SudokuLineSize; ++j){
      if (mat[0][j] == g_SudokuLineSize - 1){
        var v = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 1; i < g_SudokuLineSize; ++i){
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
        var v = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        i = Math.trunc(n / 3);
        if (n % g_SudokuZoneSize != 0){ ++i;}
        j = n - (i - 1) * g_SudokuZoneSize;
        i = (i - 1) * g_SudokuZoneSize + 1;
        j = (j - 1) * g_SudokuZoneSize + 1;
        for (k = i; k < i + g_SudokuZoneSize; ++k){
          for (l = j; l < j + g_SudokuZoneSize; ++l){
            ++v[mat[k][l]];
            if (mat[k][l] == 0){ a = k; b = l; k = l = g_SudokuLineSize + 1;}
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
  
  function verif (i, j, k) {
    for (var a = 1; a < j; ++a) {
        if (mat[i][a] == k) {return 0;}
    }
    for (var a = j + 1; a < g_SudokuLineSize; ++a) {
        if (mat[i][a] == k) {return 0;}
    }
    for (a = 1; a < i; ++a) {
        if (mat[a][j] == k) {return 0;}
    }
    for (a = i + 1; a < g_SudokuLineSize; ++a) {
        if (mat[a][j] == k) {return 0;}
    }
    
    if (i < 4){ i = 1;}
        else{ if (i > 6){ i = 7;}
              else{ i = 4;}}
    if (j < 4){ j = 1;}
        else {
            if (j > 6) {j = 7;}
            else       {j = 4;}
        }
    
    var nr = 0;
    for (var a = i ; a < i + g_SudokuZoneSize ; ++a) {
        for (var b = j; b < j + g_SudokuLineSize; ++b) {
            if (mat[a][b] == k) {++nr;}
        }
    }
    
    return nr == 0;
  }
  
  function bac (k) {
    if (k == n + 1) {
      for (var i = 1; i <= g_SudokuLineSize; ++i) {
        for (var j = 1; j <= g_SudokuLineSize; ++j) {
          boxes[g_SudokuLineSize * (i - 1) + j - 1].innerHTML = String(mat[i][j]) + " ";
        }
      }
      n = -1;
    }
    if (k > n) {return;}
    for (var ii = 1; ii <= g_SudokuLineSize; ++ii) {
      if (verif (ln[k], col[k], ii)) {
        mat[ln[k]][col[k]] = ii;
        bac(k + 1);
        mat[ln[k]][col[k]] = 0;
      }
    }
  }
  bac(1);  
}
