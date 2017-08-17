var clicks = 0;
var score = 0;
var source = "1";
var counter = 0;
var to_Score = 100;

var puzzle_Level = 4;
var puzzle_Hover = '#009900';

var stage;
var canvas;

var img;
var pieces;
var puzzleWidth;
var puzzleHeight;
var pieceWidth;
var pieceHeight;
var currentPiece;
var currentDropPiece;

var mouse;
var click = new Audio('click.mp3');
var win = new Audio('win.mp3');

function init() {
    img = new Image();
    img.addEventListener('load', cutImage, false);
    img.src = "o" + source + ".jpg";
    showElements();
}
function cutImage(e) {
    pieceWidth = Math.floor(img.width / puzzle_Level);
    pieceHeight = Math.floor(img.height / puzzle_Level);
    puzzleWidth = pieceWidth * puzzle_Level;
    puzzleHeight = pieceHeight * puzzle_Level;
    setCanvas();
    initPuzzle();

}
function setCanvas() {
    canvas = document.getElementById('canvas');
    stage = canvas.getContext('2d');
    canvas.width = puzzleWidth;
    canvas.height = puzzleHeight;
    canvas.style.border = "1px solid black";
}
function initPuzzle() {
    pieces = [];
    mouse = {x: 0, y: 0};
    currentPiece = null;
    currentDropPiece = null;
    stage.drawImage(img, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
    createTitle("Click to Start Puzzle");
    buildPieces();


}
function createTitle(msg) {
    stage.fillStyle = "#000000";
    stage.globalAlpha = .4;
    stage.fillRect(100, puzzleHeight - 40, puzzleWidth - 200, 40);
    stage.fillStyle = "#FFFFFF";
    stage.globalAlpha = 1;
    stage.textAlign = "center";
    stage.textBaseline = "middle";
    stage.font = "20px Arial";
    stage.fillText(msg, puzzleWidth / 2, puzzleHeight - 20);
}
function buildPieces() {
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for (i = 0; i < puzzle_Level * puzzle_Level; i++) {
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        pieces.push(piece);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) {
            xPos = 0;
            yPos += pieceHeight;
        }
    }
    document.onmousedown = shufflePuzzle;
}
function shufflePuzzle() {
    pieces = shuffleArray(pieces);
    stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for (i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
        stage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) {
            xPos = 0;
            yPos += pieceHeight;
        }
    }
    document.onmousedown = onPuzzleClick;
}

function shuffleArray(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
        ;
    return o;
}

function onPuzzleClick(e) {

    if (e.layerX || e.layerX === 0) {
        mouse.x = e.layerX - canvas.offsetLeft;
        mouse.y = e.layerY - canvas.offsetTop;
    } else if (e.offsetX || e.offsetX === 0) {
        mouse.x = e.offsetX - canvas.offsetLeft;
        mouse.y = e.offsetY - canvas.offsetTop;
    }
    currentPiece = checkPieceClicked();
    if (currentPiece !== null) {
        stage.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);
        stage.save();
        stage.globalAlpha = .9;
        stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
        stage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }

}
function checkPieceClicked() {
    var i;
    var piece;
    for (i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        if (mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)) {
            //piece nie klikniety
        } else {
            return piece;//piece klikniety
        }
    }
    return null;
}
function updatePuzzle(e) {
    currentDropPiece = null;
    if (e.layerX || e.layerX === 0) {
        mouse.x = e.layerX - canvas.offsetLeft;
        mouse.y = e.layerY - canvas.offsetTop;
    } else if (e.offsetX || e.offsetX === 0) {
        mouse.x = e.offsetX - canvas.offsetLeft;
        mouse.y = e.offsetY - canvas.offsetTop;
    }
    stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
    var i;
    var piece;
    for (i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        if (piece === currentPiece) {
            continue;
        }
        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        if (currentDropPiece === null) {
            if (mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)) {
                //NOT OVER
            } else {
                currentDropPiece = piece;
                stage.save();
                stage.globalAlpha = .4;
                stage.fillStyle = puzzle_Hover;
                stage.fillRect(currentDropPiece.xPos, currentDropPiece.yPos, pieceWidth, pieceHeight);
                stage.restore();
            }
        }
    }
    stage.save();
    stage.globalAlpha = .6;
    stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
    stage.restore();
    stage.strokeRect(mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
}
function pieceDropped(e) {
    document.onmousemove = null;
    document.onmouseup = null;

    if (currentDropPiece !== null) {
        var tmp = {xPos: currentPiece.xPos, yPos: currentPiece.yPos};
        currentPiece.xPos = currentDropPiece.xPos;
        currentPiece.yPos = currentDropPiece.yPos;
        currentDropPiece.xPos = tmp.xPos;
        currentDropPiece.yPos = tmp.yPos;
        clicks++;
        console.log(clicks);
        click.play();
    }
    checkWin();
}
function checkWin() {
    stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
    var gameWin = true;
    var i;
    var piece;
    for (i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        if (piece.xPos !== piece.sx || piece.yPos !== piece.sy) {
            gameWin = false;
        }
    }
    if (gameWin) {
        setTimeout(gameOver, 500);
    }
}
function gameOver() {
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    Score();
    win.play();
    document.getElementById('youWin').innerHTML = "Score:" + score;
    document.getElementById('youWin').style.display = 'block';
    document.getElementById('canvas').style.cursor = 'default';
    clicks = 0;
}

function Score() {
    score = Math.round(to_Score - ((clicks * 4))) / 2;
    if (score <= 0) {
        score = 0;
    }

}

function changeSource(e) {
    source = e;
    document.getElementById('preview').src = "o" + source + ".jpg";
    init();
}


function openNav() {
    document.getElementById("mySidenav").style.display = "block";
}

function closeNav() {
    document.getElementById("mySidenav").style.display = "none";
}



function playPause() {
    var music = document.getElementById("music");
    if (music.paused) {
        music.play();
        document.getElementById("bgmusic").style.background = "#00fc44";
    } else {
        music.pause();
        document.getElementById("bgmusic").style.background = "red";
    }
}



function randomInit() {
    var i = Math.floor((Math.random() * 6) + 1);  //from 1 to 6
    source = i;
    document.getElementById('preview').src = "o" + source + ".jpg";
    init();
}

function aNext() {
    var i;
    i = source;
    if (i < 6) {
        i++;
    } else {
        i = 1;
    }
    source = i;
    document.getElementById('preview').src = "o" + source + ".jpg";
    init();

}

function aBack() {
    var i;
    i = source;
    if (i <= 1) {
        i = 6;
    } else {
        i--;
    }
    source = i;
    document.getElementById('preview').src = "o" + source + ".jpg";
    init();

}
function volumeOnOff() {
    var audio = document.getElementById("music");
    audio.volume = 0.4;
}



function changeLevel(e) {
    to_Score = e * 3 * 100;
    puzzle_Level = e;
    init();
}

function showElements() {
    document.getElementById('youWin').style.display = 'none';
    document.getElementById('logo').style.display = 'none';
    document.getElementById('youWin').style.background = "#f7a13c";
    document.getElementById('zoom').style.display = 'block';
    document.getElementById('next').style.display = 'block';
    document.getElementById('back').style.display = 'block';
    document.getElementById('canvas').style.cursor = 'pointer';
    document.getElementById('refresh').style.display = 'block';
    document.getElementById('easy').style.display = 'block';
    document.getElementById('medium').style.display = 'block';
    document.getElementById('hard').style.display = 'block';
}






