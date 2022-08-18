async function obfusPHP(code){
let pkg = require("../package.json");
let axios = require("axios").default;
let cheerio = require("cheerio");
let re = (await axios.post("https://tools.helixs.id/home/?tools=obfuscate",{
data:new URLSearchParams(Object.entries({
php:code,
option:"High Level Obfuscation",
submit:"Submit"
}))
})).data;
let $ = cheerio.load(re);
return {status:200,creator:pkg.author,obfused:$("textarea").eq(1).text()}
}

exports.obfusPHP = obfusPHP.bind();
