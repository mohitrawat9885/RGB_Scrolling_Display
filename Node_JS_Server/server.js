var PORT = process.env.PORT || 5000;
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http');
var server = http.Server(app);
onsole.log(intToChar(2344))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

function hexToRgb(hex) {
    if (!hex) hex = '#ffffff';
    let x = [];
    hex = hex.replace('#', '')
    if (hex.length != 6) {
        hex = modifyHex(hex)
    }
    x.push(Math.floor(parseInt(hex.slice(0, 2), 16) / 2.55))
    x.push(Math.floor(parseInt(hex.slice(2, 4), 16) / 2.55))
    x.push(Math.floor(parseInt(hex.slice(4, 6), 16) / 2.55))
    return x;
}

app.get('/', (req, res) => {
    res.send('<h1>RGB Scrolling Display.</h1>');
});
app.post('/home', (req, res) => {
    console.log("Home", req.body);
    res.end(JSON.stringify(req.body, null, 2))
})
server.listen(PORT, function () {
    console.log('listening on :' + PORT);
}
);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true,
    },
    allowEIO3: true,
});

io.on('connection', function (socket) {

    console.log('a user connected');

    socket.on('client', (msg) => {
        console.log("Display:- ", msg);
    })

    socket.on('message', function (data) {
        console.log("User: Data Send.");
        let colors = [];
        for (let i = 0; i < data.colors.length; i++) {
            colors.push(hexToRgb(data.colors[i]))
        }
        for (let x = 0; x < data.text.length; x++) {
            console.log(charToInt(data.text[x]))
        }
        if (data.speed == 0) data.speed = 0;
        else data.speed = 310 - data.speed;
        io.emit('message', { "speed": data.speed, "text": data.text, "colors": colors });
    });

    socket.on('disconnect', () => {
        console.log("Client disconnect")
    })

    socket.on('connect_failed', function () {
        document.write("Sorry, there seems to be an issue with the connection!");
    })
    socket.on("error", (err) => {
        console.log("Error: ", err)
    });
});




