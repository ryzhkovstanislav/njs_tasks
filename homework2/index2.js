const minimist = require('minimist');
const LogAnalysis = require('./log_analysis');

let arguments = minimist(process.argv.slice(2));
let readLogPath = arguments['r'];

if (readLogPath) {

    if (typeof(readLogPath) === 'boolean') {
        console.log('Введите путь к файлу');
    }
    else  {
        let la = new LogAnalysis(readLogPath);

        try {
            console.log(`Количество сыгранных партий: ${la.countOfParties()}`);
            console.log('Статистика:');
            console.log(la.getStatistics());
        }
        catch (e) {
            console.log('Файл не найден');
        }
    }
}