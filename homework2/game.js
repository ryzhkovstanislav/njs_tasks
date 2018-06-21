const readLine = require('readline');
const fs = require('fs');
const MyRandom = require('./my_random');

class Game {

    constructor(logPath) {
        this.logPath = logPath;
    };

    static sayHello() {
        console.log('Привет!\nУгадай, 1 или 2?');
    }

    start() {
        const rl = readLine.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.on('line', (command) => {
            let rnd = MyRandom.oneOrTwoGetter();
            
            switch (command) {
                case '1':
                    this.check(1, rnd);
                    break;

                case '2':
                    this.check(2, rnd);
                    break;

                case 'exit':
                    rl.close();
                    break;

                default:
                    console.log('Введи число 1 или 2!');
            }

        });
    }

    check(playersNumber, computersNumber) {

        let fileName;

        if (playersNumber === computersNumber) console.log('Правильно! Давай еще!');
        else console.log('Неправильно! Попробуй еще!');

        if (this.logPath) {

            if (typeof(this.logPath) === 'boolean') fileName = 'file.csv';
            else fileName = this.logPath;

            let status = computersNumber === playersNumber;
            fs.appendFile(fileName, `${computersNumber};${playersNumber};${status}\n`, () => {});
        }
    };
}

module.exports = Game;