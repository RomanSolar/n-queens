/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

var makeEmptyMatrix = n => _(_.range(n)).map(() => _(_.range(n)).map(() => 0));

var hasInt = (setOfInts, int) => (setOfInts & (1 << int)) !== 0;
var insertInt = (setOfInts, int) => setOfInts | (1 << int);

var findSolutions = function(
  counting,
  checkDiagonals,
  board,
  rowStart = 0, colStart = 0,
  occupiedRows = 0, occupiedCols = 0, occupiedMajors = 0, occupiedMinors = 0,
  depth = 0
) {
  if (depth === board.length) {
    return counting ? 1 : board;
  }
  var solutions = 0;
  for (var row = rowStart; row < board.length; row++) {
    for (var col = row === rowStart ? colStart : 0; col < board.length; col++) {
      var major = board.length + col - row;
      var minor = col + row;
      if (
        hasInt(occupiedRows, row) ||
        hasInt(occupiedCols, col) ||
        hasInt(occupiedMajors, major) ||
        hasInt(occupiedMinors, minor)
      ) {
        continue;
      }
      var nextBoard = board.map(row => row.slice());
      nextBoard[row][col] = 1;
      var nextRow = row;
      var nextCol = col + 1;
      if (nextCol === board.length) {
        nextRow++;
        nextCol = 0;
      }
      var nextSolution = findSolutions(
        counting,
        checkDiagonals,
        nextBoard,
        nextRow, nextCol,
        insertInt(occupiedRows, row),
        insertInt(occupiedCols, col),
        checkDiagonals ? insertInt(occupiedMajors, major) : 0,
        checkDiagonals ? insertInt(occupiedMinors, minor) : 0,
        depth + 1
      );
      if (counting) {
        solutions += nextSolution;
      } else if (nextSolution) {
        return nextSolution;
      }
    }
  }
  if (counting) {
    return solutions;
  }
};

var findSolution = function(checkDiagonals, n) {
  return findSolutions(false, checkDiagonals, makeEmptyMatrix(n)) || makeEmptyMatrix(n);
};

var countSolutions = function(checkDiagonals, n) {
  return findSolutions(true, checkDiagonals, makeEmptyMatrix(n));
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n) {
  var solution = findSolution(false, n);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = countSolutions(false, n);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = findSolution(true, n);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = countSolutions(true, n); //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
