async function HaditsID(ii){
let axios = require("axios").default;
let cheerio = require("cheerio");
let h = [];
if(ii==="all"){
let ran = Math.floor(Math.random() * 701);
let $ = cheerio.load((await axios.get("http://www.hadits.id/tentang/bukhari?hadits=bukhari,muslim,dawud,tirmidzi,nasai,majah&start="+ran)).data);
$("section").each(function(li,ri){
h.push({
title:$(this).find("a").text().trim(),
data:{dari:$(this).find("span").text(),kitab:$(this).find("cite").text().split("Kitab ")[1]},
desc:$(this).find("p").text().substring(0,88)+"...",
url:"http://www.hadits.id"+$(this).find("a").attr("href")
})
})
return h
}else if(!ii){
let sr = ["bukhari","tirmidzi","nasai","majah"];
let list = sr[Math.floor(Math.random() * sr.length)];
let $ = cheerio.load((await axios.get("http://www.hadits.id/tentang/bukhari?hadits="+list)).data);
$("section").each(function(li,ri){
h.push({
title:$(this).find("a").text().trim(),
kitab:$(this).find("cite").text().split("Kitab ")[1],
desc:$(this).find("p").text().substring(0,88)+"...",
url:"http://www.hadits.id"+$(this).find("a").attr("href")
})
})
return h;
}else{ return "Nothing found!" }
}

exports.HaditsID = HaditsID.bind();
