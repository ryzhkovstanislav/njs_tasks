const request = require('request');
const readline = require('readline');
const apiKey = 'trnsl.1.1.20180624T175100Z.546c91878cbf9a72.3fe20d646112f003c0c29f7a0a196a6978d40068';
const lang = 'en-ru';
const yandexApi = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

function translateText(text, callback) {
    const yandexPreparedApi = `${yandexApi}?key=${apiKey}&text=${text}&lang=${lang}`;
    request(yandexPreparedApi, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            callback(JSON.parse(body));
        }
    });
}

console.log('Для выхода наберите /exit');
console.log('Введите слово на английском языке:');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.on('line', (command) => {
    if (command === '/exit') {
        rl.close();
    } else {
        translateText(command, (result) => {
            let translationArray = result.text;
            translationArray.forEach((element) => {
                console.log(element);
            });
            console.log('Введите слово еще раз:');
        });
    }
});
