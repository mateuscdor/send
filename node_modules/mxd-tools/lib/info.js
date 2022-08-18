async function Sejarah(q) {
let axios,cheerio;
axios = require("axios").default;
cheerio = require("cheerio");
let list = ["sejarah-dunia","sejarah-eropa","sejarah-asia","sejarah-afrika","sejarah-amerika","sejarah-australia","penemu","uncategorized"];
let num = 1;
if(list.includes(q)){
let $ = cheerio.load((await axios.get("http://sejarahdunia.web.id/category/"+q)).data);
let res = [];
$("main > article").each(function(l,r){
let desc = $(this).find("p").text();
res.push({
title:$(this).find("h2").text(),
desc:desc.substring(0,88)+"...",
postAt:$(this).find("time").text(),
category:$(this).find("span.cat-links").text(),
url:$(this).find("h2 > a").attr("href"),
imgUrl:$(this).find("img").attr("src")
})
})
return res;
}else if(!list.includes(q) && q==="list"){
return list;
}else{
return `Your value is not valid, for show available value you can use : await require("mxd-tools").sejarah("list")`
}
}

async function gsmNews(){
let axios = require("axios").default
let cheerio = require("cheerio")
let host = "https://m.gsmarena.com/";
let page = Math.floor(Math.random() * 2687);
let $ = cheerio.load((await axios.get(host+"news.php3?iPage="+page)).data);
let res = [];
$("div.news-item").each(function(x,d){
res.push({
title:$(this).find("h2").text(),
postAt:$(this).find("div.sub-hl").text(),
url:host+$(this).find("a").attr("href"),
imgUrl:$(this).find("img").attr("src")
})
})
return res;
}

exports.Sejarah = Sejarah.bind();
exports.gsmNews = gsmNews.bind();
