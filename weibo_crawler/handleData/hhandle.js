const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
let json = {
    "nodes": [{
        "id": "root",
        "group": 2
    }],
    "links": []
}

function getHtml(url, page) {
    // 构造url
    //console.log(url);
    url = url + `&__rnd=${Date.now()}&page=${page}`;
    //console.log(url);
    // 读取获取到的cookies文件
    let cookies = fs.readFileSync('./cookies.txt');
    let headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'Keep-Alive',
        'cookie': cookies.toString()
    };
    let options = {
        method: 'GET',
        url: url,
        headers: headers,
        gzip: true
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                response.setEncoding('utf-8');
                // console.log(JSON.parse(response.body));
                resolve(JSON.parse(response.body));
            } else {
                reject(error);
            }
        })
    })

}

function handleHtml(html) {
    let htmlData = html.data['html'];
    let $ = cheerio.load(htmlData);
    // console.log($);
    let repostItem;
    let repostItemTxt;
    $('.list_li.S_line1.clearfix').each(function(i, elem) {
        //console.log(i);
        repostItem = cheerio.load($(this).html());
        //console.log($(elem).html());
        // console.log(repostItem);
        //console.log((repostItem('a').text()));
        // console.log((repostItem('a').text()).search(regex));
        repostItemTxt = repostItem('a', '.WB_text').text().split(/@/);
        //console.log(repostItemTxt)
        like = repostItem('em:nth-child(2)', 'ul.clearfix').text();
        if (like == '\u8d5e') 
            like = '0';
        repost = repostItem('a', 'ul.clearfix').eq(1).text().split(' ')[1];
        if (repost == null)
            repost = '0';
        //repostItemTxt = repostItem('a').text().split(/@/);
        // 如果搜索得到 @ 的话
        //console.log(repostItemTxt);
        if (repostItemTxt.length > 1) {
            for (let i = 0; i < repostItemTxt.length; i++) {
                json.nodes.push({ "id": repostItemTxt[i], "group": 2, "layer": repostItemTxt.length - i/*, "likes": like, "reposts": repost*/ });
                if (repostItemTxt[i].length > 5)
                    if (repostItemTxt[i].slice(-5, -1) == "i评论配")
                        repostItemTxt[i] = repostItemTxt[i].slice(0, -5);
                json.nodes.push({ "id": repostItemTxt[i], "group": 2, "layer": repostItemTxt.length, "likes": like, "reposts": repost});
                // 到达转发的根
                if (i + 1 == repostItemTxt.length) {
                    json.nodes.push({ "id": repostItemTxt[0], "group": 2, "layer": repostItemTxt.length/*, "likes": like, "reposts": repost*/ });
                    json.links.push({ "target": repostItemTxt[i], "source": "root", "value": 1 });
                } else {
                    json.links.push({ "target": repostItemTxt[i], "source": repostItemTxt[i + 1], "value": 1 });
                }
            }
        } else {
            json.nodes.push({ "id": repostItemTxt[0], "group": 2, "layer": repostItemTxt.length, "likes": like, "reposts": repost });
            json.links.push({ "target": repostItemTxt[0], "source": "root", "value": 1 });
        }
        

    })
}

function handle(url, count) {
    let responseBody;
    (async() => {
        for (let i = 1; i <= count; i++) {
            console.log(`正在处理第${i}页数据`);
            await sleep(1000);
            responseBody = await getHtml(url, i);
            handleHtml(responseBody);
        }
        // 写入json到文件
        fs.writeFile('./SpiderSystem/public/json/data.json', JSON.stringify(json, null, 2), (error) => {
            if (error) {
                console.log(error);
            }
        });
    })()
}
// 设置间隔,预防被检测出爬虫
function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('ok');
        }, time)
    })
}
exports.handle = handle;