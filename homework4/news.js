const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const webAddress = 'http://www.kommersant.ru';
const enc = 'win1251';

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
            const arr = preparedStr.split('\t\t').slice(7);
            finalArr = arr.filter((el, index) => {
                return index % 2 === 0;
            });
        }
        callback(finalArr);
    });
}

module.exports = getNews;
