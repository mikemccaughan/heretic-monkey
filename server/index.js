var express = require('express');
var website = process.env.website || require('path').resolve('../dist');
var app = express();
console.log(website);
app.use(express.static(website));
app.get('*', function (req, res) {
    res.sendFile('index.html', { root: website });
});
var port = process.env.port || '8118';
app.listen(port, function () { return console.log("app running on port ".concat(port)); });
