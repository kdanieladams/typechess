/**
 * Dev Server
 * 
 * This is a bare-bones development server written for NodeJS.
 */

const http = require('http');
const fs = require('fs');

var hostname = '127.0.0.1';
var port = 3000;

http.createServer(function (request, response) {
    var url = request.url == '/' ? '/index.html' : request.url;
    var queryString = '';
    var qoffset = url.lastIndexOf('?');

    // isolate query string
    if(qoffset != -1) {
        let urlArr = url.split('?');
        queryString = urlArr[1];
        url = urlArr[0];
    }

    fs.readFile('./dist/' + url, function(err, data) {
        if (!err) {
            let dotoffset = url.lastIndexOf('.');
            let mimetype = '';
            
            mimetype = dotoffset == -1
                ? 'text/plain'
                : {
                    '.html' : 'text/html',
                    '.ico' : 'image/x-icon',
                    '.jpg' : 'image/jpeg',
                    '.png' : 'image/png',
                    '.gif' : 'image/gif',
                    '.css' : 'text/css',
                    '.js' : 'text/javascript'
                }[ url.substr(dotoffset) ];
                
            response.setHeader('Content-type' , mimetype);
            response.end(data);
            console.log( url, mimetype );
        } else {
            console.log ('file not found: ' + request.url);
            response.writeHead(404, "Not Found");
            response.end();
        }
    });
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
