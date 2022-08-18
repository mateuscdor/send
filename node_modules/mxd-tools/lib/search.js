async function Pypi(q) {
let axios = require("axios").default;
let cheerio = require("cheerio");
let $ = cheerio.load((await axios.get("https://pypi.org/search/?q="+q)).data);
let py = [];
$("ul.unstyled > li").each(function(x,c){
py.push({
name:$(this).find("span").eq(0).text(),
version:$(this).find("span").eq(1).text(),
released:$(this).find("span").eq(2).text().trim(),
desc:$(this).find("p").text().trim(),
url:"https://pypi.org"+$(this).find("a").attr("href")
})
})
return py;
}

async function Npmjs(q) {
let axios = require("axios");
let cheerio = require("cheerio");
let host = "https://www.npmjs.com";
let $ = cheerio.load((await axios.get(host+"/search?q="+q+"&perPage=20")).data);
let r = [];
$("section.ef4d7c63.flex-l.pl1-ns.pt3.pb2.ph1.bb.b--black-10 > div._0d2164ff").each(function(a,b){
let kw = $(this).find("ul > li");
r.push({
name:$(this).find("div.bea55649.flex.flex-row.flex-wrap.items-end.pr3 > a > h3").text(),
url:host+$(this).find("div.bea55649.flex.flex-row.flex-wrap.items-end.pr3 > a").attr("href"),
desc:$(this).find("p").text().trim(),
keyword:[kw.eq(0).text(),kw.eq(1).text(),kw.eq(2).text(),kw.eq(3).text()],
data:{published:$(this).find("span._66c2abad.black-50.flex-grow-1").text().split("•")[1].trim(),version:$(this).find("span._66c2abad.black-50.flex-grow-1").text().split(" •")[0].substring(10)}
})
})
return r;
}

async function getCountry(q){
let axios = require("axios").default;
let cheerio = require("cheerio");
async function allCountry(){
let $ = cheerio.load((await axios.get("https://46elks.com/kb/country-codes")).data);
let a = [];
$("table.cc-table > tbody > tr").each(function(l,r){
let name = $(this).find("td:nth-child(4)").text();
let code = $(this).find("td:nth-child(3)").text();
a.push({
name:name.toLowerCase(),
code:code.toLowerCase(),
dialCode:$(this).find("td:nth-child(1)").text(),
flags:{name:code,flag:$(this).find("td:nth-child(2)").text()}
})
})
return a;
}
async function getDataC(i) {
let $ = cheerio.load((await axios.get("https://countrycode.org/"+i)).data);
let res = {};
let ress = [];
let sup = $("#collapseStatistics").find("ul > li > ul > li");
$("#collapseCityCodes > table > tbody > tr").each(function(l,r){
ress.push({
city:$(this).find("td").eq(0).text(),
dialNumber:$(this).find("td").eq(1).text()
})
})
res.name = $("title").text().split(" Country Code")[0];
res.ibuKota = sup.eq(0).text();
res.ISO_ALPHA = [$("div.box-green").eq(0).find("h3").text(),$("div.box-green").eq(1).find("h4").text()];
res.populasi = sup.eq(1).text();
res.luasWilayah = sup.eq(2).text().split("KM2")[0]+"Km²";
res.localTime = $("div.table-responsive.text-uppercase > table").find("h3[id='current-time']").text();
flag = cheerio.load((await axios.get("https://flagpedia.net/"+res.name)).data);
res.flags = flag("nav.flag-buttons").find("span").text().trim();
res.dialCode = $("div.box-blue.pull-left.map-cover").find("h2").text();
res.users = {phone:sup.eq(4).text(),mobilePhone:sup.eq(5).text(),internetHosts:sup.eq(6).text()};
res.cityCodes = ress;
return res;
}
let all = await allCountry();
let co = all.map(i => i.code);
let nam = all.map(u => u.name);
let num = all.map(u => u.dialCode);
let flag = all.map(l => encodeURIComponent(l.flags.flag));
let find= all.find(a => a.flags.flag == q);
if(co.includes(q)) return await getDataC(q);
else if(num.includes("+"+q)) return await getDataC(`${q}`);
else if(nam.includes(q)) return await getDataC(q);
else if(flag.includes(encodeURIComponent(q))) return await getDataC(find.flags.name);
else return "Can't find country!";
}

async function Pricebook(i){
let axios,cheerio;
axios = require("axios").default;
cheerio = require("cheerio");
async function search(q){
let s = cheerio.load((await axios.get("https://www.pricebook.co.id/search?keyword="+q+"&product=all")).data);
let ri = [];
s("div.small-8.columns.right-content").each(function(lin,rin){
ri.push({
name:$(this).find("h5").text().trim(),
released_year:$(this).find("span").eq(0).text(),
price:$(this).find("span").eq(4).text(),
url:$(this).find("a").attr("href")
})
})
return ri;
}
if(typeof i === 'string'){
return await search(i);
}else if(!i){
let $ = cheerio.load((await axios.get("https://www.pricebook.co.id/shop-update")).data);
let r = [];
$("div.panel.inset").each(function(ri,li){
r.push({
title:$(this).find("h6").text().trim(),
store:{name:$(this).find("div.small.text-orange > a").text().trim(),url:$(this).find("div.small.text-orange > a").attr("href")},
price:$(this).find("h5").text().trim(),
details:$(this).find("a").eq(0).attr("href")
})
})
return r;
}else{ return "Did you stupid?"; }
}

async function gsmSpecs(q){
cheerio = require("cheerio");
axios = require("axios").default;
let host = "https://m.gsmarena.com/";
let href = cheerio.load((await axios.get(host+"res.php3?sSearch="+q)).data)("div.swiper-half-slide").find("a").attr("href");
let $ = cheerio.load((await axios.get(host+href)).data);
let res = {};
let sup = $("table[cellspacing=0]");
res.name = $("h1.section.nobor").text();
res.released = $("div.quick-specs.vote.swiper-slide").find("span:nth-child(1)").text();
res.capacity = {ram:$("div.swiper-wrapper > ul > li:nth-child(3)").find("strong").text(),rom:$("div.quick-specs.vote.swiper-slide").find("span:nth-child(4)").text()}
res.display = {type:sup.find("td[data-spec='displaytype']").text(),size:sup.find("td[data-spec='displaysize']").text(),resolution:sup.find("td[data-spec='displayresolution']").text()};
res.device = {os:sup.find("td[data-spec='os']").text(),chipset:sup.find("td[data-spec='chipset']").text(),cpu:sup.find("td[data-spec='cpu']").text(),gpu:sup.find("td[data-spec='gpu']").text(),models:sup.find("td[data-spec='models']").text()};
res.camera = {mainCamera:$("div.swiper-wrapper > ul > li:nth-child(2)").find("strong").text(),selfieCamera:sup.find("td[data-spec='cam2modules']").text()};
res.NFC = sup.find("td[data-spec='nfc']").text();
res.usb = sup.find("td[data-spec='usb']").text();
res.sensors = sup.find("td[data-spec='sensors']").text();
res.battery = {power:$("div.swiper-wrapper > ul > li:nth-child(4)").find("strong").text(),type:$("div.swiper-wrapper > ul > li:nth-child(4)").find("span[data-spec='battype-hl']").text()};
res.colors = sup.find("td[data-spec='colors']").text();
res.price = sup.find("td[data-spec='price']").text();

return res;
}

async function gsmBrand(q){
cheerio = require("cheerio");
axios = require("axios").default;
let host = "https://m.gsmarena.com/";
let $ = cheerio.load((await axios.get(host+"results.php3?sQuickSearch=yes&sName="+q)).data);
let res = [];
$("div.general-menu.material-card > ul > li").each(function(l,r){
res.push({
name:$(this).find("strong").text(),
url: host+$(this).find("a").attr("href"),
imgUrl:$(this).find("img").attr("src")
})
})
return res;
}

exports.Pypi = Pypi.bind();
exports.Npmjs = Npmjs.bind();
exports.getCountry = getCountry.bind();
exports.Pricebook = Pricebook.bind();
exports.gsmArena = gsmSpecs.bind();
exports.gsmSearchbrand = gsmBrand.bind();
