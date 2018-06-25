const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const webAddress = 'http://www.kommersant.ru';
const enc = 'win1251';
// const enc = 'utf8';

function getNews(callback) {
    request({
        method: 'GET',
        uri: webAddress,
        encoding: null,
    }, (err, res, body) => {
        let finalArr;
        if (!err && res.statusCode === 200) {
            const $ = cheerio.load(iconv.decode(body, enc));
            const preparedStr = $('.b-newsline__item').text();
            const arr = preparedStr.split('\t\t').slice(2);
            finalArr = arr.filter((el, index) => {
                if (index % 2 === 1) {
                    return el;
                }
            });
        } else {
            return console.error('Ошибка или код не равен 200');
        }
        callback(finalArr);
    });
}

getNews((arg) => {
    console.log('All news:');
    arg.forEach((el) => {
        console.log(el);
    });
});
