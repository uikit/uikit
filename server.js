var http  = require("http"),
    url   = require("url"),
    path  = require("path"),
    fs    = require("fs"),
    port  = process.argv[2] || 3000,

    mimeTypes = {
      'css'   : 'text/css',
      'htm'   : 'text/html',
      'html'  : 'text/html',
      'json'  : 'application/json',
      'js'    : 'application/x-javascript',
      'txt'   : 'text/plain',
      'bmp'   : 'image/bmp',
      'rss'   : 'application/rss+xml',
      'atom'  : 'application/atom+xml',
      'gif'   : 'image/gif',
      'jpeg'  : 'image/jpeg',
      'jpg'   : 'image/jpeg',
      'jpe'   : 'image/jpeg',
      'png'   : 'image/png',
      'ico'   : 'image/vnd.microsoft.icon',
      'zip'   : 'application/zip',
      'pdf'   : 'application/pdf',
      'gzip'  : 'application/x-gzip',
      'swf'   : 'application/x-shockwave-flash',
      'tar'   : 'application/x-tar',
      'tiff'  : 'image/tiff',
      'tif'   : 'image/tiff',
      'xsl'   : 'text/xml',
      'xml'   : 'text/xml',
      'svg'   : 'image/svg+xml'
    };

http.createServer(function(request, response) {

    // send no cache headers
    response.setHeader("Expires", "Sat, 6 May 1995 12:00:00 GMT");
    response.setHeader("Cache-Control", ["no-store, no-cache, must-revalidate", "post-check=0, pre-check=0"]);
    response.setHeader("Pragma", "no-cache");

    var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists) {

        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.end("404 Not Found");
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        if(!fs.existsSync(filename)) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.end("404 Not Found");
            return;
        }

        fs.readFile(filename, "binary", function(err, file) {

            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.end(err);
                return;
            }

            var ext = filename.replace(/.*[\.\/\\]/, '').toLowerCase();

            response.writeHead(200, {"Content-Type": (mimeTypes[ext] || "text/plain")});
            response.end(file, "binary");
        });
    });

}).listen(parseInt(port, 10));

console.log("Static server running at  : http://localhost:" + port + "/\nCTRL + C to shutdown");