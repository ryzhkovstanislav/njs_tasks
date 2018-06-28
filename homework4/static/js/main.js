const newsItem = document.getElementById('news-item');
const b1 = document.getElementById('b1');

b1.onclick = () => {
    const xml = new XMLHttpRequest();
    const value = encodeURIComponent(document.getElementById('exampleInputNumber').value);
    const body = `itemNumber=${value}`;
    xml.open('POST', '/', true);
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xml.send(body);
    xml.onload = () => {
        const o = JSON.parse(xml.responseText);
        console.log(o);
        newsItem.innerText = o['item'];
    }
};
