var socket = io.connect('https://socketioduysy.herokuapp.com/');
var idRobotcontrol = document.getElementById("idVideocallRobot").textContent;
var up = document.getElementById('up');
var down = document.getElementById('down');
var left = document.getElementById('left');
var right = document.getElementById('right');

var Socleft = function () {
    console.log('left');
    socket.emit('RobotControl', {
        idRobotcontrol: idRobotcontrol,
        data: "ROBOT-trai"
    });
}
var Socright = function () {
    console.log('right');
    socket.emit('RobotControl', {
        idRobotcontrol: idRobotcontrol,
        data: "ROBOT-phai"
    });
}
var Socup = function () {
    console.log('up');
    socket.emit('RobotControl', {
        idRobotcontrol: idRobotcontrol,
        data: "ROBOT-len"
    });
}
var Socdown = function () {
    console.log('down');
    socket.emit('RobotControl', {
        idRobotcontrol: idRobotcontrol,
        data: "ROBOT-xuong"
    });
}
//button click
holdit(up, Socdown);

holdit(down, Socup);

holdit(left, Socright);

holdit(right, Socleft);
//Key board click
document.onkeydown = KeyCheck;
document.onkeyup = function () {
    console.log('dung');
    socket.emit('RobotControl', {
        idRobotcontrol: idRobotcontrol,
        data: "ROBOT-dung"
    });
};
function KeyCheck() {
    var KeyID = event.keyCode;
    switch (KeyID) {
        case 37:
            Socright();
            break;
        case 39:
            Socleft();
            break;
        case 38:
            Socdown();
            break;
        case 40:
            Socup();
            break;
    }

}

function holdit(btn, action) {
    var t;

    var repeat = function () {
        action();
        t = setTimeout(repeat, 100);
    }

    btn.onmousedown = function () {
        repeat();
    }

    btn.onmouseup = function () {
        clearTimeout(t);
    }
};


function cong() {
    var elem = document.getElementById("myBar");
    var height = document.getElementById("myBar").offsetHeight;
    var heightProg = document.getElementById("myProgress").offsetHeight;
    height = height + 20;
    if (height >= heightProg) {
        height = 0;
    }
    elem.style.height = height + "px";
}

function tru() {
    var elem = document.getElementById("myBar");
    var height = document.getElementById("myBar").offsetHeight;
    if (height == 0) {
        height = 0;
    }
    height = height - 20;
    elem.style.height = height + "px";
}

