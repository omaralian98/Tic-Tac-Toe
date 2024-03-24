let count = 0;
let finished = true, gameover = false;
var Ground = new Array (
    ' ', ' ', ' ',
    ' ', ' ', ' ', 
    ' ', ' ', ' '
);
var practice = undefined;
var player = undefined, curPlayer;
var bestMoveIndex = new Array();

function Reset() {//This function will reset the game.
    count = 0;
    finished = true;
    gameover = false;
    Ground = new Array(' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ');
    practice = undefined;
    player = undefined;
    curPlayer = undefined;
    bestMoveIndex = new Array();
    for (let i = 1; i <= 9; i++) { //The canvas are being replaced with new ones.
        var newCanvas = document.createElement("canvas");
        newCanvas.style.fill = "transparent";
        newCanvas.style.width = "150px";
        newCanvas.style.height = "150px";
        let id = "b" + i;
        var canvas = document.getElementById(id);
        canvas.replaceChild(newCanvas, canvas.childNodes[0]);
    }    
    var newCanvas = document.createElement("canvas");
    newCanvas.style.width = "466px";
    newCanvas.style.height = "478px";
    newCanvas.style.backgroundColor = "transparent";
    newCanvas.style.position = "absolute";
    newCanvas.style.zIndex = -5;
    newCanvas.style.marginLeft = "10px";
    newCanvas.style.marginTop = "10px";
    newCanvas.id = "playground";
    var parent = document.getElementById("game");
    var canvas = document.getElementById("playground");
    parent.replaceChild(newCanvas, canvas);

    var temp = document.getElementById("choosedif");
    temp.style.zIndex = 10;
    temp.style.visibility = "visible";

    var buttons = document.getElementsByClassName("choosegamemode");
    for (let it of buttons) {
        it.style.visibility = "visible";
        it.style.fontSize = "26px";
    }
    buttons[0].innerHTML = "1vs1";
    buttons[1].innerHTML = "Practice";
}
function BotTurn() {
    if (finished) {
        let tempor = new Array(' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ');
        for (let i = 0; i < Ground.length; i++) {
            tempor[i] = Ground[i]; 
        }
        bestMoveIndex = new Array();
        MiniMax(tempor, 0, player == 'x'? false : true);
        Draw(bestMoveIndex[rand(0, bestMoveIndex.length)] + 1);
    }
}
function DrawHtml(index) {
    if (!practice)
        setTimeout(BotTurn, 1500);
    Draw(index);
}
function Draw(index) {
      /*Here the main function for the drawing commands
        if the drawing timesout is finished(finished === true) if not no thing happens
        and if the index of the drawing is not used(Ground[index - 1] === " ") if it's used 
        no thing happens
        and if the game is not over yet(gameover === false)*/
    if (finished && Ground[index - 1] == " " && gameover == false) {
        let id = "b" + index;
        var canvas = document.getElementById(id).childNodes[0];
        Ground[index - 1] = curPlayer;
        finished = false;
        eval(`Draw${curPlayer.toUpperCase()}(canvas)`);
        count++;
        if (curPlayer === 'x') {
            curPlayer = 'o';
        }
        else {
            curPlayer = 'x';
        }
        if (count >= 5) {
            let winner = CheckWin();
            if (winner != " ") {
                gameover = true;
            }
            else if (winner == " " && count >= 9) {
                gameover = true;
            }
        }
    }
}
function DrawX(canvas) {
  /*Here we are drawing the X*/
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 7;
    let done = true;
    DrawAnimated(10, 10, 380, 200);
    function DrawAnimated(startX, startY, endX, endY) {
        var amount = 0;
        var timer = setInterval(function () {
            amount += 0.05;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "purple";
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
            ctx.stroke();
            if (amount >= 1) {
                clearInterval(timer);
                if (done) {
                    DrawAnimated(290, 10, 10, 150);
                }
                else {
                  /*when the animation is over we will set finished to ture indicating that we can draw again
                    and if the player is playing aginst the bot the Calbot function will be fired*/
                    finished = true;
                }
                done = false;
            }
        }, 10);
    };
}
function DrawO(canvas) {
  /*Here we are drawing the O*/
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 5;
    ctx.strokeStyle = "purple";
    var i = 0;
    function draw() {
        if (i < 100) {
            i += 5;
        }
        var percentage = i / 100;
        var degrees = percentage * 360.0;
        var radians = degrees * (Math.PI / 180);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.arc(150, 75, 70, 0, radians, false);
        ctx.stroke();
        if (i < 100) {
            requestAnimationFrame(draw);
        }
        else {
          /*when the animation is over we will set finished to ture indicating that we can draw again
            and if the player is playing aginst the bot the Calbot function will be fired*/
            finished = true;
        }
    }
    requestAnimationFrame(draw);
}
function DrawWin(p) {
    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.style.zIndex = 5;
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    DrawAnimated(p[0], p[1], p[2], p[3]);

    function DrawAnimated(startX, startY, endX, endY) {
        var amount = 0;
        var timer = setInterval(function () {
            amount += 0.05;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
            ctx.stroke();
            if (amount >= 1) {
                clearInterval(timer);
            }
        }, 10);
    };
}

function CheckWin() {
  /*This function will check if there is winner yet or not and it will be called after each move*/
    var points = new Array(), pass = " ";
    if (Ground[0] != " " && (Ground[0] === Ground[1] && Ground[0] === Ground[2])) {
        points[0] = new Array(0, 25, 300, 25);
        points[1] = new Array(300, 25, 0, 25);
        pass = Ground[1];
    }
    else if (Ground[3] != " " && (Ground[3] === Ground[4] && Ground[3] === Ground[5])) {
        points[0] = new Array(0, 75, 300, 75);
        points[1] = new Array(300, 75, 0, 75);
        pass = Ground[4];
    }
    else if (Ground[6] != " " && (Ground[6] === Ground[7] && Ground[6] === Ground[8])) {
        points[0] = new Array(0, 125, 300, 125);
        points[1] = new Array(300, 125, 0, 125);
        pass = Ground[7];
    }
    else if (Ground[0] != " " && (Ground[0] === Ground[3] && Ground[0] === Ground[6])) {
        points[0] = new Array(50, 0, 50, 150);
        points[1] = new Array(50, 150, 50, 0);
        pass = Ground[3];
    }
    else if (Ground[1] != " " && (Ground[1] === Ground[4] && Ground[1] === Ground[7])) {
        points[0] = new Array(150, 0, 150, 150);
        points[1] = new Array(150, 150, 150, 0);
        pass = Ground[4];
    }
    else if (Ground[2] != " " && (Ground[2] === Ground[5] && Ground[2] === Ground[8])) {
        points[0] = new Array(250, 0, 250, 150);
        points[1] = new Array(250, 150, 250, 0);
        pass = Ground[5];
    }
    else if (Ground[0] != " " && (Ground[0] === Ground[4] && Ground[0] === Ground[8])) {
        points[0] = new Array(0, 0, 300, 150);
        points[1] = new Array(300, 150, 0, 0);
        pass = Ground[4];
    }
    else if (Ground[2] != " " && (Ground[2] === Ground[4] && Ground[2] === Ground[6])) {
        points[0] = new Array(300, 0, 0, 150);
        points[1] = new Array(0, 150, 300, 0);
        pass = Ground[4];
    }
    if (pass != " ")
        setTimeout(DrawWin, 500, points[rand(0, 2)]);
    return pass;
}

function Choose(a, caller) {
    if (practice == undefined) {
        practice = caller.innerHTML === "Practice" ? true : false;
        if (practice) {
            curPlayer = 'x';
            setTimeout(StartGame, 1050);
        }
    }
    else if (player == undefined){
        player = a;
        curPlayer = 'x';
    }
    if (player == 'o') {
        setTimeout(BotTurn, 1500);
    }
    var buttons = document.getElementsByClassName("choosegamemode");
    let x = rand(2);
    if (x == 0) {
        Out(buttons);
        setTimeout(Out2, 1000, buttons);
    }
    else {
        Out2(buttons);
        setTimeout(Out, 1000, buttons);
    }
    setTimeout(() => {
        for (var obj of buttons) {
            obj.style.visibility = "hidden";
        }
    }, 400);
    if (player == undefined) {
        setTimeout(() => {
            for (let i = 0; i < 2; i++) {
                buttons[i].style.fontSize = "82px";
                buttons[i].style.visibility = "visible";
            }
            buttons[0].innerHTML = "X";
            buttons[1].innerHTML = "O";
        }, 999);
    }
    else {
        setTimeout(StartGame, 1000);
    }
}
function Out(obj) {
    for (let i = 0; i < obj.length; i++) {
        if (i % 2 == 0) {
            AnimateButtons(obj[i], -9);
        }
        else {
            AnimateButtons(obj[i], 9);
        }
    }
}
function Out2(obj) {
    for (let i = 0; i < obj.length; i++) {
        if (i % 2 == 0) {
            AnimateButtons(obj[i], 9);
        }
        else {
            AnimateButtons(obj[i], -9);
        }
    }
}
function AnimateButtons(obj, opera) {
    var style = getComputedStyle(obj);
    var temp = style.getPropertyValue("margin-top");
    let st = parseInt(temp.substring(0, temp.length - 2));
    var counter = 0;
    var inter = setInterval(() => {
        st += opera;
        eval(`obj.style.marginTop = "${st}px"`);
        if (counter > 30){
            clearInterval(inter);
        }
        counter++;
    }, 10);
}
function StartGame() {
    var buttons = document.getElementsByClassName("choosegamemode");
    buttons[0].style.visibility = "hidden";
    buttons[1].style.visibility ="hidden";
    var temp = document.getElementById("choosedif");
    temp.style.zIndex = -10;
    temp.style.visibility = "hidden";
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
function rand(max) {
    return Math.floor(Math.random() * (max));
}
function PlayBest() {
    if (finished) {
        let tempor = new Array(' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ');
        for (let i = 0; i < Ground.length; i++) {
            tempor[i] = Ground[i]; 
        }
        bestMoveIndex = new Array();
        MiniMax(tempor, 0, Player(Ground) == 'x'? false : true);
        Draw(bestMoveIndex[rand(0, bestMoveIndex.length)] + 1);
    }
}


function Terminal(a) {
  /*This function will check if there is winner yet or not and it will be called after each move*/
    if (a[0] !== ' ' && (a[0] === a[1] && a[0] === a[2])) {
        return { test: true, winner: a[0] };
    } 
    else if (a[3] !== ' ' && (a[3] === a[4] && a[3] === a[5])) {
        return { test: true, winner: a[3] };
    } 
    else if (a[6] !== ' ' && (a[6] === a[7] && a[6] === a[8])) {
        return { test: true, winner: a[6] };
    } 
    else if (a[0] !== ' ' && (a[0] === a[3] && a[0] === a[6])) {
        return { test: true, winner: a[0] };
    } 
    else if (a[1] !== ' ' && (a[1] === a[4] && a[1] === a[7])) {
        return { test: true, winner: a[1] };
    } 
    else if (a[2] !== ' ' && (a[2] === a[5] && a[2] === a[8])) {
        return { test: true, winner: a[2] };
    } 
    else if (a[0] !== ' ' && (a[0] === a[4] && a[0] === a[8])) {
        return { test: true, winner: a[0] };
    } 
    else if (a[2] !== ' ' && (a[2] === a[4] && a[2] === a[6])) {
        return { test: true, winner: a[2] };
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] === ' ') {
            return { test: false, winner: ' ' };
        }
    }
    return { test: true, winner: ' ' };

}
function Value(Ground, depth) {
    const { test, winner } = Terminal(Ground);
    if (test) {
        if (winner === 'o') {
            return depth - 10;
        } else if (winner === 'x') {
            return 10 - depth;
        }
    }
    return 0;
}
function Actions(Ground) {
    const moves = [];
    for (let i = 0; i < Ground.length; i++) {
        if (Ground[i] === ' ') {
            moves.push(i);
        }
    }
    return moves;
}
function Result(Ground, index, action) {
    const temp = Ground.slice();
    temp[index] = action;
    return temp;
}
function Player(Ground) {
    let o = 0, x = 0;
    for (let it of Ground) {
        if (it == 'o')
            o++;
        else if (it == 'x')
            x++;
    }
    return x == o ? 'x' : 'o';
} 
function MiniMax(Ground, depth, isMaximized) {
    const { test, winner } = Terminal(Ground);
    if (test || depth > 9) {
        return Value(Ground, depth);
    }
    if (isMaximized) {
        let value = Number.MIN_SAFE_INTEGER;
        const moves = Actions(Ground);
        for (const move of moves) {
            const temp = MiniMax(Result(Ground, move, 'x'), depth + 1, false);
            if (temp >= value) {
                if (depth == 0 && temp == value)
                {
                    bestMoveIndex.push(move);
                }
                else if (depth == 0 && temp > value)
                {
                    bestMoveIndex = new Array();
                    bestMoveIndex.push(move);
                }
                value = temp;
            }
        }
        return value;
    } 
    else {
        let value = Number.MAX_SAFE_INTEGER;
        const moves = Actions(Ground);
        for (const move of moves) {
            const temp = MiniMax(Result(Ground, move, 'o'), depth + 1, true);
            if (temp <= value) {
                if (depth == 0 && temp == value)
                {
                    bestMoveIndex.push(move);
                }
                else if (depth == 0 && temp < value)
                {
                    bestMoveIndex = new Array();
                    bestMoveIndex.push(move);
                }
                value = temp;
            }
        }
        return value;
    }
}