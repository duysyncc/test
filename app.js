var express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { Console } = require('console');
var app = express();

app.use(bodyParser.raw({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: false
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.text({ limit: "50mb" }));

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 80);

app.use(express.static('public'))
app.use(express.text())
let cacheHtml = {}
let cacheDesktop = {}

app.get('/', (req, res) => {
  res.send('truy cập  /room/:id');
})

app.get('/room/:id', (req, res) => {
  let data = fs.readFileSync('./public/html/view.html');
  res.send(data.toString()
    .replace('idListen', req.params.id)
    .replace('idListen', req.params.id)
    .replace('idListen', req.params.id)
    .replace('idListen', req.params.id)
    .replace('idListen', req.params.id)
    .replace('idListen', req.params.id)
    .replace('idListen', req.params.id));

  // res.sendFile('./public/html/view.html', { "root": __dirname ,"idListen":req.params.id});
})

app.get('/cacheHtml/:id', (req, res) => {
  res.send(cacheHtml[req.params.id]);
})

app.get('/cacheDesktop/:id', (req, res) => {
  res.send(cacheDesktop[req.params.id]);
})

app.get('/key/:id', (req, res) => {
  if (req.params.id == "68fhjr883758937uw") {
    res.send("TRUE");
  } else {
    res.send("FALSE");
  }

})

io.on('connection', function (socket) { //Bắt sự kiện một client kết nối đến server
  socket.on('all client', function (data) { //lắng nghe event 'all client'
    io.sockets.emit('news', data); // gửi cho tất cả client
  });

  app.post('/roomHtml/:id', function (req, res) {
    io.sockets.emit(`roomHtml/${req.params.id}`, req.body);
    cacheHtml[req.params.id] = req.body;
    res.send("roomHtml-DONE")
  })

  app.post('/roomDesktop/:id', function (req, res) {
    io.sockets.emit(`roomDesktop/${req.params.id}`, req.body);
    cacheDesktop[req.params.id] = req.body;
    res.send("roomDesktop-DONE")
  })

  app.get('/click/:id/:w/:h/:x/:y/', function (req, res) {
    let data = {
      w: req.params.w,
      h: req.params.h,
      x: req.params.x,
      y: req.params.y
    }
    io.sockets.emit(`/click/${req.params.id}`, data);
    console.log(data)
    res.send("click-DONE")
  })

  // socket.emit('news',data); // chỉ gửi event cho client hiện tại
  // socket.broadcast.emit('news', data);// gửi event cho tất cả các client từ client hiện tại
  // io.to().emit('message', 'for your eyes only');
});
// app.get('/:id', (req, res) => {
//   io.to(req.params.id).emit('news', 'for your eyes only');
//   res.send('user ' + req.params.id)
// })
// var LZString = require('lz-string');
// var string = "This is my compression test.";
// console.log("Size of sample is: " + string.length);
// var compressed = LZString.compress(string);
// console.log("Size of compressed sample is: " + compressed);
// string = LZString.decompress(compressed);
// console.log("Sample is: " + string);

