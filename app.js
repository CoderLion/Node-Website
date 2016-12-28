var express = require('express');
var app = express();
var path = require('path');
var router = express.Router();

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

app.use("/", router);
app.use('/', express.static(__dirname));
app.use('/pics', express.static(__dirname + "/pics"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})

