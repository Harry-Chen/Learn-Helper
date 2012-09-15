/* 
 * DOMParser HTML extension 
 * 2012-02-02 
 * 
 * By Eli Grey, http://eligrey.com 
 * Public domain. 
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK. 
 */  

/*! @source https://gist.github.com/1129031 */  
/*global document, DOMParser*/  

(function(DOMParser) {  
    "use strict";  
    var DOMParser_proto = DOMParser.prototype  
      , real_parseFromString = DOMParser_proto.parseFromString;

    // Firefox/Opera/IE throw errors on unsupported types  
    try {  
        // WebKit returns null on unsupported types  
        if ((new DOMParser).parseFromString("", "text/html")) {  
            // text/html parsing is natively supported  
            return;  
        }  
    } catch (ex) {}  

    DOMParser_proto.parseFromString = function(markup, type) {  
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {  
            var doc = document.implementation.createHTMLDocument("")
              , doc_elt = doc.documentElement
              , first_elt;

            doc_elt.innerHTML = markup;
            first_elt = doc_elt.firstElementChild;

            if (doc_elt.childElementCount === 1
                && first_elt.localName.toLowerCase() === "html") {  
                doc.replaceChild(first_elt, doc_elt);  
            }  

            return doc;  
        } else {  
            return real_parseFromString.apply(this, arguments);  
        }  
    };  
}(DOMParser));



var resp = '';
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp", false);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		resp = xhr.responseText;
	}
}
xhr.send();
//resp = resp.replace(/(\r\n|\n|\r)/gm," ");
resp = "<!DOCTYPE html><html><body><head></head>" + resp + "</body></html>"
document.getElementById('test').innerText = resp;

//var reg = new RegExp('<tr class="info_tr[\S\s]*</tr>');

//var result = reg.exec(resp);
//console.log(result);

var k = jQuery.parseXML(resp);
console.log(k);
