// scripts.js

let uiMatrix;
//counter to get out of infinite loop
let c = 0;
//inner counters for collecting data
let inner = 0, col = 0, square = 0, loopS = 0;
//global variables for first board generating
let first = 0;
let firstBoard = true;

 /*-----------------------------------\
|----------Board functions------------|
\-----------------------------------*/

//initialize the 9x9 matrix
function initMatrix () {
    let mainMatrix = [[0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0]];

    return mainMatrix;
}

//a method for printing the matrix to the log, so it is more readable
function printMatrix (matrix) {
    let string = "[";

    for (let i = 0; i < matrix.length; i++) {
        if (i > 0) {
            string += " [";
        } else {
            string += "[";
        }
        for (let j = 0; j < matrix[i].length; j++) {

            if (j == matrix[i].length-1) {
                string += matrix[i][j];
            } else {
                string += matrix[i][j]+", ";
            }
        }
        if (i == matrix.length -1) {
            string += "]"
        } else {
            string += "],\n";
        }
    }
    string += "]";

    return string;
}

/*this method generates solved sudoku*/
function distributeSudoku(matrix) {

    let numIndex = 0;
    let innerCounter = -1; //for the inner do while loop
    iLoop:
    for (let i = 0 ; i < 9 ; i++) {
        let numArray = [1,2,3,4,5,6,7,8,9];
        jLoop:
        for (let j = 0 ; j < 9 ; j++) {

            if (i == 0) { //this is for the first line

                numIndex = Math.floor(Math.random()*numArray.length); //random number between 0 to length-1
                matrix[i][j] = numArray[numIndex]; //putting values 1 to 9 from numArray (which are randomly chosen) in the matrix
                numArray.splice(numIndex, 1); //removing the number we used from numArray

            } else if (i == 8) { //this is the last row

                let restNums = [1,2,3,4,5,6,7,8,9];
                let index = 0;
                //going through the column j, and removing the number that exist in that column from the restNums array
                //the last number left in the restNums array is the number we put in the [8][j] place. in the next iteration of j
                //we start all over again
                for (let h = 0; h < 8; h++) {
                    index = restNums.indexOf(matrix[h][j]);
                    restNums.splice(index, 1);
                }
                matrix[i][j] = restNums[0];

            } else { // the rest of the board - lines 1 to 7

                doLoop:
                do {
                    innerCounter++; //counter that prevents going into infinite loop
                    numIndex = Math.floor(Math.random()*numArray.length); //random number between 0 to length-1
                    matrix[i][j] = numArray[numIndex];

                    if (c > 5000){ // c is an inner counter that increment each time we enter to: line 104 if, checkColumn(), checkSquare(), loopSquare()
                        console.log("innerCount = "+inner+"\ncheckColumn = "+col+"\ncheckSquare = "+square+"\nloopSquare = "+loopS);
                        c = 0, inner = 0, col = 0, square = 0, loopS = 0;
                        break iLoop;
                    }

                    //processing enters this if the do-while loop gets 'stuck' at the same place [i][j] over 45 times
                    if (innerCounter > 45) {
                        inner++; //inner counter to see how many times we go in this if condition
                        c++;
                        innerCounter = 0;
                        for (let k = j; k >= 0; k--) { // resetting the line to 0's
                            matrix[i][k] = 0;
                        }
                        numArray = [1,2,3,4,5,6,7,8,9];// resetting numArray
                        j = -1; //setting j to start from the beginning of the line
                        continue jLoop;
                    }
                //if one of these conditions is true, then we already have that number in a column and/or in the square
                } while (checkColumn(i, j, matrix) || checkSquare(i, j, matrix));

                numArray.splice(numIndex, 1);
            } //end of else - lines 1 to 8
        }
    }
    console.log(printMatrix(matrix));
    //storing the solved matrix in local storage in order to access it later
    localStorage.setItem("matrix", matrix);
    return matrix;
}

//checking to see if the number exists alredy in the column
function checkColumn(i, j, matrix) {
    col++;
    c++;
    let existInCol = false;
    let counter = 0;
    // k < i --> checking the column only for values that are literaly above line k (i.e. if k=5, then we check the column j, in lines 0, 1, 2 and 3)
    for (let k = 0 ; k < i ; k++) {
        if (matrix[i][j] == matrix[k][j] && i != k) {
            existInCol = true;
            break;
        }
    }
    return existInCol;
}

/*checking if the specific number at matrix[i][j] already exists inside the square we are in*/
function checkSquare (i, j, matrix) {
    square++;
    c++;
    let existInSquare = false;
                               // [1,1,1]
                               // [0,0,0]
    if (i <= 2) { //top squares   [0,0,0]

        if (j <= 2) {                 // top left squre
            existInSquare = loopSquare(0,2,0,2, i, j , matrix);
        } else if (j > 2 && j <= 5) {//top middle square
            existInSquare = loopSquare(0,2,3,5, i, j , matrix);
        } else {                     // j > 5 ; top right square
            existInSquare = loopSquare(0,2,6,8, i, j , matrix);
        }
                                                  // [0,0,0]
                                                  // [1,1,1]
    } else if (i > 2 && i <= 5) { //middle squares   [0,0,0]

        if (j <= 2) {                 // left middle squre
            existInSquare = loopSquare(3,5,0,2, i, j , matrix);
        } else if (j > 2 && j <= 5) { //middle middle square
            existInSquare = loopSquare(3,5,3,5, i, j , matrix);
        } else {                      // j > 5 ; right middle square
            existInSquare = loopSquare(3,5,6,8, i, j , matrix);
        }
                                          // [0,0,0]
                                          // [0,0,0]
    } else  {     // i > 5 ;  bottom squares [1,1,1]

        if (j <= 2) {                 // bottom left squre
            existInSquare = loopSquare(6,8,0,2, i, j , matrix);
        } else if (j > 2 && j <= 5) { //bottom middle square
            existInSquare = loopSquare(6,8,3,5, i, j , matrix);
        } else {                      // j > 5 ; bottom right square
            existInSquare = loopSquare(6,8,6,8, i, j , matrix);
        }

    }

    return existInSquare;
}

/*loops over the 3x3 square to check if the value at matrix[i][j] exist*/
let loopSquare = (startRowIdx, endRowIdx, startColumnIdx, endColumnIdx, i , j, matrix) => { //i, j are the current position
    c++;
    loopS++
    let existInSquare = false;
    for (let row = startRowIdx; row <= endRowIdx; row++) {
        for (let column = startColumnIdx; column <= endColumnIdx; column++) {
            if (matrix[i][j] == matrix[row][column] && (i != row || j != column) && matrix[i][j] != "") {
                existInSquare = true;
            }
        }
    }
    return existInSquare;
}

/*updating the ui with uiMatrix values - so that any cell that is 0, will be an input*/
let updateUIMatrix = (matrix) => {
  let identifier = "c";
  let counter = 1;
  uiLoop:
  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          //creating the identifier of the <td> elements so we can access them, and put our input inside them
          if (counter < 10) {
              identifier += "0" + counter;
          } else {
              identifier += counter;
          }

          if (matrix[i][j] != 0) {
              document.getElementById(identifier).innerHTML = matrix[i][j]+"";
          } else if (first == 0) {
              break uiLoop;
          } else { //matrix[i][j] == 0
              document.getElementById(identifier).innerHTML = "<input class=\"arrow-togglable\" type=\"text\" maxlength=\"1\" value=\"\" oninput=\"checkSquareForCell("+(identifier) +")\" onfocus=\"clearRedBorder("+(identifier) +")\">";
          }
          identifier = "c";
          counter++;
      }
  }
}

//getting the UI Matrix in its current state, boolean @isString - weather we want the input values as string (true) or int (false)
function getUIMatrix() {
    let localMatrix = initMatrix();
    //gets all td elements in an array
    let tdArray = document.querySelectorAll("td");

    for (let i = 0; i < 81; i++) {
        //getting the row and column indices
        let rowIndex = Math.floor(i / 9);
        let columnIndex = i % 9;
        //checking if the <td> element has input childNode
        if (tdArray[i].firstChild.nodeName == "INPUT") {
            localMatrix[rowIndex][columnIndex] = tdArray[i].firstChild.value;
        } else {
            localMatrix[rowIndex][columnIndex] = parseInt(tdArray[i].innerHTML);
        }
    }

    return localMatrix;
}


function revealCells(matrix, uiMatrix, limit) {
    for (let i = 0 ; i < 9 ; i++) {
        idxArray = [];
        for (let j = 0 ; j < limit ; j++) {
            idx = Math.floor(Math.random()*9); //random index between 0 to 8
            if (idxArray.indexOf(idx) == -1) {//checking to see if the randon index already exists
                idxArray.push(idx);
                uiMatrix[i][idx] = matrix[i][idx];
            } else {
                j--;
                continue;
            }
        }
    }
}


function revealRandomCells(matrix, uiMatrix ,difficulty) {
    if (difficulty == 2) {       //hard
        revealCells(matrix, uiMatrix, 2);
    } else if (difficulty == 1) {//mid
        revealCells(matrix, uiMatrix, 3);
    } else {                     //easy - default
        revealCells(matrix, uiMatrix, 4);
    }
}

/*onclick the clear button*/
function clearBoard() {
    document.querySelector('.bg-modal').style.display = 'flex';
    document.querySelector(".modalBtnContainer1").style.display = "block";
    document.querySelector(".modalBtnContainer2").style.display = "none";
    document.querySelector(".modalBtnContainer3").style.display = "none";
    document.getElementById("avatarImg").src = "avatar06.png";
    document.getElementById("modalText").innerHTML = "This will delete all your labor. \nAre you sure?";
}

/*clear all inputs when confirming the alert modal*/
document.querySelector('.modal-ok-btn').addEventListener('click', function(){
    //getting the <td> elements id property
    let identifier = "c";
    let counter = 1;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (counter < 10) {
                identifier += "0" + counter;
            } else {
                identifier += counter;
            }
            let td = document.getElementById(identifier);
            //erase the inputs values in the UI, if the child node of the td is an input;
            // if (td.children.length == 0) then <td>'s child is just text
            if (td.children.length > 0 && td.children[0].nodeName == "INPUT") {
                document.getElementById(identifier).innerHTML = "<input class=\"arrow-togglable\" type=\"text\" maxlength=\"1\" value=\"\" oninput =\"checkSquareForCell("+(identifier) +")\" onfocus=\"clearRedBorder("+(identifier) +")\" >";
            }
            identifier = "c";
            counter++;
        }
    }
    //'closes' the modal alert
    document.querySelector('.bg-modal').style.display = 'none';
});

function closeModal() {
    document.querySelector('.bg-modal').style.display = 'none';
}

//get the solved matrix we stored in local storage, and converting it to a matrix with numbers so we can work with it
function getMatrixFromStorage() {
    let matrixString = localStorage.getItem("matrix").split(",");
    let matrix = initMatrix();
    let index = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            matrix[i][j] = parseInt(matrixString[index]);
            index++;
        }
    }
    return matrix;
}

//checking if the UImatrix is equal to the solved matrix we generated
function isMatricesEqual() {

    let matrix = getMatrixFromStorage();

    console.log(matrix);
    let solution = true;
    let identifier = "c";
    let counter = 1;
    mainLoop:
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (counter < 10) {
                identifier += "0" + counter;
            } else {
                identifier += counter;
            }
            let td = document.getElementById(identifier);
            if (td.firstElementChild != null && td.children[0].nodeName == "INPUT") {
                if (td.children[0].value != matrix[i][j]) {
                    solution = false;
                    break mainLoop;
                }
            } else {
                if (td.innerHTML != matrix[i][j]) {
                    solution = false;
                    break mainLoop;
                }
            }

            identifier = "c";
            counter++;
        }
    }
    return solution;
}

//checking if the matrix is solved, whene the solution is different from the generated matrix
function checkUIMatrixSolution() {

  let matrix = getUIMatrix();
  let index = 0;
  let flag = true;

  mainLoop:
  for (let i = 0; i < 9; i++) {
      let numArray = [1,2,3,4,5,6,7,8,9];
      for (let j = 0; j < 9; j++) {
          //checking if each cell in the row i appears once, by removing it from numArray at each iteration
          index = numArray.indexOf(parseInt(matrix[i][j]));
          //this happens if a number appers twice or not at all
          if (index == -1) {
              continue;
          }
          numArray.splice(index,1);
          if (i > 0) { //for the second row on - we check if the value at row i column j exists alswhere in the board
              if (checkSquare(i, j, matrix) || checkColumn(i, j, matrix)) {
                  flag = false;
                  break mainLoop;
              }
          }
      }
        //if there are still numbers in numArray - it means that a number appears twice or there is an empty cell
      if (numArray.length > 0) {
          flag = false;
          break mainLoop;
      }
  }

  return flag;
}

function checkSolution() {
      let username = localStorage.getItem("storageName");
      if (isMatricesEqual() || checkUIMatrixSolution() ) {
          //alert the win
          document.getElementById("avatarImg").src = "avatar01.png";
          document.getElementById("modalText").innerHTML = "You Won!";
          document.querySelector(".modalBtnContainer1").style.display = "none";
          document.querySelector(".modalBtnContainer2").style.display = "none";
          document.querySelector(".modalBtnContainer3").style.display = "block";
          document.querySelector('.bg-modal').style.display = 'flex';
      } else {
          //elsert loss + ask if the user wants to satrt again
          document.getElementById("avatarImg").src = "avatar03.png";
          document.getElementById("modalText").innerHTML = "You havn't solved the borad. \nTry again";
          document.querySelector(".modalBtnContainer1").style.display = "none";
          document.querySelector('.modalBtnContainer2').style.display = "none";
          document.querySelector(".modalBtnContainer3").style.display = "none";
          document.querySelector('.bg-modal').style.display = 'flex';
      }
}

document.querySelector(".modal-gen-over-btn").addEventListener('click', function(){
    let level = localStorage.getItem("level");
    generateSoduko(level);
});


function generateSoduko(level) {
    let result;
    if (firstBoard) { //first time going to the board - don't ask me if i am sure
        result = true;
        firstBoard = false;
    } else { //all other times the user will generate a new board - ask if he is sure
        document.getElementById("avatarImg").src = "avatar02.png";
        document.getElementById("modalText").innerHTML = "This will create a new board. \nWould you still like to continue?";
        document.querySelector(".modalBtnContainer1").style.display = "none";
        document.querySelector('.modalBtnContainer2').style.display = "block";
        document.querySelector(".modalBtnContainer3").style.display = "none";
        document.querySelector('.bg-modal').style.display = 'flex';

        document.querySelector('.modal-gen-btn').addEventListener('click', function(){
            //result = true;
            document.querySelector('.bg-modal').style.display = 'none';
            //if the level give is different than the chosen level, set level to be the current level
            if (level != localStorage.getItem('level')) {
                level = localStorage.getItem('level');
            }
            generateSudokuMatrix(level);
        });
    }

    if (result) {
        let matrix = [];
        do {
            matrix = initMatrix(); //initiallizing the matrix
            updateUIMatrix(matrix); //clear the text fields if there are any
            distributeSudoku(matrix); //creating the solved Sudoku
            first++;
        } while (matrix.toString().indexOf("0") != -1);

        uiMatrix = initMatrix();

        revealRandomCells(matrix, uiMatrix, level) //revealing cell according to difficulty
        updateUIMatrix(uiMatrix); //updating the UI Matrix
    }

}


function generateSudokuMatrix(level) {
    let matrix = [];
    do {
        matrix = initMatrix(); //initiallizing the matrix
        updateUIMatrix(matrix); //clear the text fields if there are any
        distributeSudoku(matrix); //creating the solved Sudoku
        first++;
    } while (matrix.toString().indexOf("0") != -1);

    uiMatrix = initMatrix();

    revealRandomCells(matrix, uiMatrix, level) //revealing cell according to difficulty
    updateUIMatrix(uiMatrix); //updating the UI Matrix
}


function changeToChosenLevel(level) {
    //getting an array of all buttons with class name 'level' - so we can know weather the guest button was pressed or on of the other level buttons (easy, hard, medium)
    let btns = document.getElementsByClassName("level");

    if (btns[0].innerHTML == "Guest") {
       localStorage.setItem("isGuest", true);
    } else {
        localStorage.setItem("isGuest", false);
    }
    //saving the chosen level at localStorage so it won't disappear on loading the next HTML
    //since the stored data is saved across browser sessions
    localStorage.setItem("level", level);
    //going to the board page
    window.location.href = "board.html";

}

//on board.html load this function is called and generates the board for the chosen level
function goToBoard() {
    //getting the level we stored on the localStorage
    let level = localStorage.getItem("level");
    let isGuest = (localStorage.getItem("isGuest") == "true");

    //getting the username we stored on the localStorage
    if (isGuest) {
        document.getElementById("btnName").innerHTML = "Guest";
    } else {
        let username = localStorage.getItem("storageName");
        document.getElementById("btnName").innerHTML = username;
    }

    if (level == 0) {         //easy level
        document.getElementById("btnLevel").innerHTML = "Easy";
        generateSoduko(0);
    } else if (level == 1) { //medium level
        document.getElementById("btnLevel").innerHTML = "Medium";
        generateSoduko(1);
    } else {                    //hard level
        document.getElementById("btnLevel").innerHTML = "Hard";
        generateSoduko(2);
    }

}

 /*-----------------------------------\
|------Board Playing functions--------|
\-----------------------------------*/

//when an arrow key is pressed inside in inputes then we recognize the event and move inside the inputs array accordingly
document.onkeydown = function(event) {
    //gets all input cells as an HTMLCollection
    let elements = document.getElementsByClassName("arrow-togglable");
    let currentIndex = 0, idx = 0;
    let uiMatrixGlobal = getUIMatrix();
    //setting the inputs with ids
    for (let i = 0 ; i < 9 ; i++) {
        for (let j = 0 ; j < 9 ; j++) {
            //check if the input value is empty string or a string number (the other elements are ints - which are not inputs, but just plain innerHTML text)
            if (uiMatrixGlobal[i][j] == "" || typeof(uiMatrixGlobal[i][j]) == "string") {
                let rowNum = (i * 9) + 1;
                let colNum = (j % 9) /*+ 1*/;
                elements[idx].id = (rowNum+colNum);
                idx++;
            }
        }
    }
    //getting the index from the event target which is the input
    currentIndex = parseInt(event.target.id);
    console.log("currentIndex = "+currentIndex);
    let lastIdx = parseInt(elements[elements.length-1].id);
    let inputInx = 0;
    //debugger;
    switch (event.keyCode) {
        case 37: //leftArrow
            currentIndex = (currentIndex == 0) ? lastIdx : --currentIndex;
            inputInx = findInputIndex(elements, currentIndex);
            while (elements[inputInx] == undefined) {
                currentIndex = (currentIndex == 0) ? lastIdx : --currentIndex;
                inputInx = findInputIndex(elements, currentIndex);
            }
            elements[inputInx].focus();
            currentIndex = 0;
            break;
        case 38: //upArrow
            currentIndex = (currentIndex == 0 || (currentIndex -9) < 0 ) ? lastIdx : currentIndex -= 9;
            inputInx = findInputIndex(elements, currentIndex);
            while (elements[inputInx] == undefined) {
                currentIndex = (currentIndex == 0 || (currentIndex -9) < 0 ) ? lastIdx : currentIndex -= 9;
                inputInx = findInputIndex(elements, currentIndex);
            }
            elements[inputInx].focus();
            currentIndex = 0;
            break;
        case 39: //rightArrow ==> if we reached the end, go to the beginning
            currentIndex = ((currentIndex + 1) > lastIdx) ? 0 : ++currentIndex;
            inputInx = findInputIndex(elements, currentIndex);
            while (elements[inputInx] == undefined) {
                //debugger;
                currentIndex = ((currentIndex + 1) > lastIdx) ? 0 : ++currentIndex;
                inputInx = findInputIndex(elements, currentIndex);
            }
            elements[inputInx].focus();
            currentIndex = 0;
            break;
        case 40: //downArrow ==> if we reached the end, go to the beginning
            currentIndex = ( ( (currentIndex + 1) == 81) ||((currentIndex + 9) > lastIdx) )  ? 0 : currentIndex += 9;
            inputInx = findInputIndex(elements, currentIndex);
            while (elements[inputInx] == undefined) {
                currentIndex = ( ( (currentIndex + 1) == 81) ||((currentIndex + 9) > lastIdx) )  ? 0 : currentIndex += 9;
                inputInx = findInputIndex(elements, currentIndex);
            }
            elements[inputInx].focus();
            currentIndex = 0;
            break;
    }
};

function findInputIndex(inputArray, inputId) {
    for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i].id == inputId) {
            return i;
        }
    }
}

function columnValidation(i, j, matrix) {
    let existInColumn = false;
    for (let k = 0 ; k < 9 ; k++) {
        if (matrix[i][j] == matrix[k][j] && i != k && matrix[k][j] != "") {
            existInColumn = true;
            break;
        }
    }
    return existInColumn;
}

function rowValidation(i, j, matrix) {
  let existInRow = false;
  for (let k = 0 ; k < 9 ; k++) {
      if (matrix[i][j] == matrix[i][k] && j != k && matrix[i][k] != "") {
          existInRow = true;
          break;
      }
  }
  return existInRow;
}

/*input.oninput*/
/*this function is checking to see if there is another number on the board that is equal to the current input value*/
function checkSquareForCell(identifier) {
    //identifier is an html tag object <td>
    let cellId = identifier.getAttribute("id") + ""; //getting the id of the html tag <td>
    let cellIdString = cellId.slice(1,3); //removing the 'c' from the string
    let cellIndex = parseInt(cellIdString); //casting into integer

    //current indices of row and column we are in
    let columnNum = (cellIndex - 1) % 9;
    let rowNum = Math.floor((cellIndex - 1) / 9);

    let checkedMatrix = getUIMatrix();    //getting the uiMatrix
    //console.log(printMatrix(checkedMatrix));
    if (checkSquare(rowNum, columnNum, checkedMatrix)) {
        let identifier = "c" + rowNum + columnNum;
        document.getElementById(cellId).style = "background-color: red";
        console.log(document.getElementById(cellId));
        //mark the square in red
        paintSquare(rowNum, columnNum, checkedMatrix, "red");
    } else {
        clearRedBorder(identifier);
    }

    if (columnValidation(rowNum, columnNum, checkedMatrix)) {
        let identifier = "c" + rowNum + columnNum;
        // paintColumn(rowNum, columnNum, checkedMatrix, "red");
        paintCells(0, 8,  columnNum, columnNum, checkedMatrix, "red");
        //mark column red
    }

    if (rowValidation(rowNum, columnNum, checkedMatrix)) {
        let identifier = "c" + rowNum + columnNum;
        //paintRow(rowNum, columnNum, checkedMatrix, "red");
        paintCells(rowNum, rowNum,  0, 8, checkedMatrix, "red");
        //mark row in red
    }
}

function paintSquare (i, j, matrix, color) {
                               // [1,1,1]
                               // [0,0,0]
    if (i <= 2) { //top squares   [0,0,0]

        if (j <= 2) {                 // top left squre
            paintCells(0,2,0,2, matrix, color);
        } else if (j > 2 && j <= 5) {//top middle square
            paintCells(0,2,3,5, matrix, color);
        } else {                     // j > 5 ; top right square
            paintCells(0,2,6,8, matrix, color);
        }
                                                  // [0,0,0]
                                                  // [1,1,1]
    } else if (i > 2 && i <= 5) { //middle squares   [0,0,0]

        if (j <= 2) {                 // left middle squre
            paintCells(3,5,0,2, matrix, color);
        } else if (j > 2 && j <= 5) { //middle middle square
            paintCells(3,5,3,5, matrix, color);
        } else {                      // j > 5 ; right middle square
            paintCells(3,5,6,8, matrix, color);
        }
                                          // [0,0,0]
                                          // [0,0,0]
    } else  {     // i > 5 ;  bottom squares [1,1,1]

        if (j <= 2) {                 // bottom left squre
            paintCells(6,8,0,2, matrix, color);
        } else if (j > 2 && j <= 5) { //bottom middle square
            paintCells(6,8,3,5, matrix, color);
        } else {                      // j > 5 ; bottom right square
            paintCells(6,8,6,8, matrix, color);
        }
    }
}

//"paints" or changes the background of the <td> elements according to the parameters
function paintCells(startRowIdx, endRowIdx, startColumnIdx, endColumnIdx, matrix, color) {
    let identifier = "c";
    for (let row = startRowIdx; row <= endRowIdx; row++) {
        for (let column = startColumnIdx; column <= endColumnIdx; column++) {
            let rowNum = (row * 9) + 1;
            let colNum = (column % 9) ;
            let index = rowNum + colNum;
            if (index < 10) {
                identifier += "0" + index;
            } else {
                identifier += index;
            }

            document.getElementById(identifier).style = "background-color: "+color;

            identifier = "c";
        }
    }
}


function clearRedBorder(identifier) {

    let cellId = identifier.getAttribute("id") + ""; //getting the id of the html tag <td>
    let cellIdString = cellId.slice(1,3); //removing the 'c' from the string
    let cellIndex = parseInt(cellIdString); //casting into integer

    let columnNum = (cellIndex - 1) % 9;
    let rowNum = Math.floor((cellIndex - 1) / 9);

    let matrix = getUIMatrix();

    paintCells(0, 8, 0, 8, matrix, "#dddddd");
}

 /*-----------------------------------\
|-------register functions------------|
\-----------------------------------*/

function validateForm() {
    let isValid = true;
    //getting the html elements
    let username = document.getElementById("regUsername");
    let password = document.getElementById("regPassword");
    let confirmPassword = document.getElementById("regConfirm");
    let email = document.getElementById("regEmail");

    if (!usernameChecker(username.value)) {
        username.nextElementSibling.innerHTML = "username is incorrect";
        isValid = false;
    }

    if (!passwordChecker(password.value)) {
        password.nextElementSibling.innerHTML = "password is incorrect";
        isValid = false;
    }

    if (password.value != confirmPassword.value) {
        confirmPassword.nextElementSibling.innerHTML = "Passwords do not match..";
        isValid = false;
    }

    if (!emailChecker(email.value)) {
        email.nextElementSibling.innerHTML = "Email is invalid";
        isValid = false;
    }

    localStorage.setItem("storageName", username.value);
    localStorage.setItem("storagePass", password.value);
    localStorage.setItem("storageEmail", email.value);

    if (isValid) {
        localStorage.setItem("snackbar", true);
    }

    return isValid;
}

function clearRegText() {
    let errorTextArray = document.getElementsByClassName("errorMsg");
    for (let i = 0; i < errorTextArray.length; i++) {
      errorTextArray[i].innerHTML = "";
    }
    let username = document.getElementById("regUsername");
    username.style.border = "1.3px solid #366ed8";
}

function clearRegInputBorder() {
    let username = document.getElementById("regUsername");
    let password = document.getElementById("regPassword");
    let confirmPassword = document.getElementById("regConfirm");
    let email = document.getElementById("regEmail");

    username.style.border = "1px solid  #bfbfbf";
    password.style.border = "1px solid  #bfbfbf";
    confirmPassword.style.border = " 1px solid  #bfbfbf";
    email.style.border = "1px solid  #bfbfbf";
}

function checkUsername(){
    let username = document.getElementById("regUsername");

    if (username.value.length >= 6 && containsCharacterAscii(username.value, 'A', 'Z')) {
        username.style.border = "1.3px solid blue";
    } else {
        username.style.border = "1.3px solid red";
    }
}

function checkPassword(){
    let password = document.getElementById("regPassword");

    if (password.value.length >= 6 && containsCharacterAscii(password.value, 'A', 'Z') && containsCharacterAscii(password.value, '!', '/') && containsCharacterAscii(password.value, '0', '9')) {
        password.style.border = "1.3px solid blue";
    } else {
        password.style.border = "1.3px solid red";
    }
}

function containsCharacterAscii(string, startChar, endChar) {
    let flag = false;
    for (let i = 0; i < string.length; i++) {
        if (string[i] >= startChar && string[i] <= endChar) {
            flag = true;
            break;
        }
    }
    return flag;
}

function checkPasswordMatch(){
  let password = document.getElementById("regPassword");
  let confirmPassword = document.getElementById("regConfirm");
  if (password.value != confirmPassword.value) {
      confirmPassword.style.border = "1.3px solid red";
  } else {
      confirmPassword.style.border = "1.3px solid blue";
  }

}

function checkEmail(){
    let email = document.getElementById("regEmail");
    if (!emailChecker(email.value)) {
        email.style.border = "1.3px solid red";
    } else {
        email.style.border = "1.3px solid blue";
    }
}

/*this function is checking the valitidy of an email:
--has at least 5 characters
--contains "@" and the strings to its left and right has at least a length 2
--the "." character comes after the "@ character
--has atleast 2 characters after the "." character */
function emailChecker(email) {
    let flag = true;

    let leftStr = email.slice(0, email.indexOf("@"));
    let rightStr = email.slice(email.indexOf("@")+1, email.length);

    let lastTwoChars = email.slice(email.length-2, email.length);
    let isLastChar = (lastTwoChars.charAt(1) >= 'A' && lastTwoChars.charAt(1) <= 'Z') || (lastTwoChars.charAt(1) >= 'a' && lastTwoChars.charAt(1) <= 'z')
    let isBeforeLastChar = (lastTwoChars.charAt(0) >= 'A' && lastTwoChars.charAt(0) <= 'Z') || (lastTwoChars.charAt(0) >= 'a' && lastTwoChars.charAt(0) <= 'z')
    let isLastTwoChars = isLastChar && isBeforeLastChar;

    if (email.length < 5 || rightStr.indexOf(".") == -1 || leftStr.length <= 1 || rightStr.length <= 1 || !isLastTwoChars) {
        flag = false;
    }

    if (email.indexOf('@') == -1) {
        flag = false;
    }

    return flag;
}

function passwordChecker(password) {
    let flag = true;

    if (password < 6 || !containsCharacterAscii(password, 'A', 'Z') || !containsCharacterAscii(password, '!', '/') || !containsCharacterAscii(password, '0', '9')) {
        flag = false;
    }
    return flag;
}

function usernameChecker(username) {
    let flag = true;

    if (username.length < 6 || !containsCharacterAscii(username, 'A', 'Z')) {
        flag = false;
    }
    return flag;
}

function goToLoginPage() {
    localStorage.setItem("snackbar", false);
    window.location.href= 'login.html';
}

/*snackbar notification*/

function showSnackbar() {
    // Get the snackbar DIV
    let snackbar = document.getElementById("logSnackbar");
    let isSnackbar = localStorage.getItem("snackbar");

    if (isSnackbar === "true") {
        snackbar.innerHTML = "Registeration of "+localStorage.getItem("storageName")+" was successful";
        snackbar.className = "show";
    }

    // After 3 seconds, remove the show class from DIV
    setTimeout( function(){
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);

}

 /*-----------------------------------\
|----------Login functions------------|
\-----------------------------------*/

function validateLogin() {
   let isValid = true;
   //getting the html elements
   let username = document.getElementById("logUsername");
   let password = document.getElementById("logPassword");

   let storedUsername = localStorage.getItem("storageName");
   let storedPassword = localStorage.getItem("storagePass");

   if (username.value != storedUsername) {
       username.className += "wrongInput";
       username.nextElementSibling.innerHTML = "username is incorrect";
       isValid = false;
   }

   if (password.value != storedPassword) {
       password.className += "wrongInput";
       password.nextElementSibling.innerHTML = "password is incorrect";
       isValid = false;
   }

   return isValid;
}

function clearLogText() {
    let errorTextArr = document.getElementsByClassName("errorMsg");
    for (let i = 0; i < errorTextArr.length; i++) {
      errorTextArr[i].innerHTML = "";
    }
    //debugger;
    let username = document.getElementById("logUsername");
    username.style.border = "1.3px solid #366ed8;";
}

/*-----------------------------------\
|-------welcom functions--------------|
\-----------------------------------*/

function greetUser() {
   //greets the user - "Hello User" in welcome page
   document.getElementById("welcomHead").innerHTML += localStorage.getItem("storageName");
}



//end
