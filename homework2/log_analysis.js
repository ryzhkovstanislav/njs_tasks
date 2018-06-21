const fs = require('fs');

class LogAnalysis {

    constructor(filePath) {
        this.filePath = filePath;
    }

    readLines() {
        return fs.readFileSync(this.filePath, (err, data) => {
            if (err) throw err;
        });
    }

    getStringArray() {
        return this.readLines().toString().split('\n').slice(0, -1);
    }

    countOfParties() {
        return this.getStringArray().length;
    }

    getStatistics() {
        let lines = this.getStringArray();
        let lineArray;
        let winnerParties = 0;
        let loserParties = 0;
        let statusArray = [];

        for (let i = 0; i < lines.length; i++) {
            lineArray = lines[i].split(';');
            if (lineArray[2] === 'true') winnerParties++;
            else loserParties++;
            statusArray.push(lineArray[2]);
        }

        let continiousWins = [];
        let continiousLosses = [];
        let countWins = 0;
        let countLosses = 0;

        for (let i = 0; i < statusArray.length; i++) {
            if (statusArray[i] === 'true') {
                countWins++;
                continiousLosses.push(countLosses);
                countLosses = 0;
            }
            else {
                countLosses++;
                continiousWins.push(countWins);
                countWins = 0;
            }
        }
        continiousWins.push(countWins);
        continiousLosses.push(countLosses);

        return {
            wins: winnerParties,
            losses: loserParties,
            winsPercent: (winnerParties / lines.length).toFixed(2),
            lossesPercent: (loserParties / lines.length).toFixed(2),
            maxContiniousWins: Math.max.apply(Math, continiousWins),
            maxContiniousLosses: Math.max.apply(Math, continiousLosses),
        }
    }
}

module.exports = LogAnalysis;
