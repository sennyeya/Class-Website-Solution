const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var scraper = async (obj)=>{
    obj["urls"] = ["http://u.arizona.edu/~mccann/classes/372/index.html", "http://www.u.arizona.edu/~jmisurda/teaching/csc335/fall2019/index.html"];
    obj["tags"] = [["a"], ["a"]]
    obj["attributes"] = [["name"], ["id"]]
    obj["attributeNames"] = [["ASSIGNMENTS"],["Projects","Labs"]];

    for(let url in obj["urls"]){
        var i =0, j =0, k = 0;
        var and = false;
        while(true){
            await getDOMElements(obj, obj["urls"][url], obj["tags"][url][i], obj["attributes"][url][j], obj["attributeNames"][url][k]);
            if(obj["tags"][url].length-1>i){
                i +=1;
            }
            if(obj["attributes"][url].length-1>j){
                j+=1;
            }
            if(obj["attributeNames"][url].length-1>k){
                k+=1;
            }
            if(obj["attributeNames"][url].length-1<=k&&obj["attributes"][url].length-1<=j&&obj["tags"][url].length-1<=i){
                if(i===0&&j===0&&k===0){
                    break;
                }
                await getDOMElements(obj, obj["urls"][url], obj["tags"][url][i], obj["attributes"][url][j], obj["attributeNames"][url][k]);
                break;
            }
        }
    }

    return new Promise((res, rej)=>{
        res(obj);
    })
}

module.exports.test = async () =>{
    var obj = {};
    await scraper(obj);

    var str = "";
    var doms = {};

    for(let url of obj["urls"]){
        for(let val in obj[url]){
            if(obj[url][val].toString()==="[object HTMLUListElement]"){
                for(let child of obj[url][val].childNodes){
                    if(child.toString()==="[object HTMLLIElement]"){
                        let strHTML = child.innerHTML.toString();
                        console.log(url);
                        str += relativeToAbsolute(strHTML, url.replace("/index.html","/"))//.replace(/href=\"\./g,"href=\""+obj["urls"][val].replace("/index.html","")).replace(/href=\"/g,"href=\""+obj["urls"][val].replace("index.html",""));
                    }
                }
            }
        }
        doms[url] = new JSDOM(str, {url:url, referrer:url, contentType:"text/html", includeNodeLocations:true});
        console.log(doms[url]);
        str = "";
    }

    for(let val of obj["urls"]){
        str+=doms[val].serialize();
    }
    console.log(str);
    const newDom = new JSDOM(str);

    return new Promise((res, rej)=>res(newDom.serialize()));
}

function relativeToAbsolute(html, url){
    var hrefs = html.split("href=\"");
    var newStr = hrefs[0];
    for(let val in hrefs){
        if(val==0){
            continue;
        }

        newStr+="href=\"";
        if(hrefs[val].startsWith("http")){
            newStr+=hrefs[val];
            continue;
        }
        
        if(/[a-z]/gi.test(hrefs[val][0])){
            newStr+=url+hrefs[val];
        }
        if(hrefs[val][0]=="."||hrefs[val][0]=="/"){
            var parseStr = hrefs[val];
            var parseUrl = url;
            while(parseStr[0]=="."||parseStr[0]=="/"){
                if(parseStr[0]=="."){
                    parseUrl = parseUrl.substring(0, parseUrl.lastIndexOf("/"));
                    console.log(parseUrl);
                }
                if(parseStr[0]=="/"){
                    parseUrl = parseUrl+"/";
                }
                parseStr = parseStr.substring(1);
            }
            newStr+=parseUrl+parseStr;
        }
        console.log(newStr)
    }
    return newStr;
}

async function getDOMElements(obj, url, tagName, attribute, attributeValue) {
    const mccann = await JSDOM.fromURL(url);
    for (let val of mccann.window.document.getElementsByTagName(tagName)) {
        if (val.getAttribute(attribute) === attributeValue) {
            if (!obj[url]) {
                if(val.parentElement.nextElementSibling){
                    obj[url] = [val.parentElement.nextElementSibling];
                }else if(val.nextElementSibling.nextElementSibling){
                    obj[url] = [val.nextElementSibling.nextElementSibling]
                }
            }
            else {
                if(val.parentElement.nextElementSibling){
                    obj[url].push(val.parentElement.nextElementSibling);
                }else if(val.nextElementSibling.nextElementSibling){
                    obj[url].push(val.nextElementSibling.nextElementSibling);
                }
                
            }
        }
    }
}
