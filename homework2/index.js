const minimist = require('minimist');
const Game = require('./game');

let arguments = minimist(process.argv.slice(2));
let logPath = arguments['l'];

let game = new Game(logPath);
Game.sayHello();
game.start();
