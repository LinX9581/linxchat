var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;

var MONGODB_URI = 'mongodb://admin:[your mlab password]@ds249311.mlab.com:49311/sockettest';

app.use(express.static('public'));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});

//一對多
app.get('/all/', function(req, res) {
    res.sendFile(__dirname + '/index1.html');
});



//JSON.stringify();
var usocket = {},
    user = [];

io.on('connection', (socket) => { //(socket)=>  等於 function(socket){}
    //username=客戶端傳來用戶輸入的name
    socket.on('new user', (username) => {
        if (!(username in usocket)) { //username指向usocket
            socket.username = username; //給予每個username一個socket
            usocket[username] = socket;
            user.push(username); //在陣列尾新增元素 ，並返回新的長度
            socket.emit('login', user);
            socket.broadcast.emit('user joined', username, (user.length - 1));
            console.log(user);

        }
    })

    //私人
    socket.on('send private message', function(res) {
        console.log(res); //可看chat.html res格式
        //msg to db
        MongoClient.connect(MONGODB_URI, function(err, db) {
            if (err) throw err;
            var collection = db.collection('dbtest');
            var req = {
                'body': res
            };
            collection.insert(req);
        });
        if (res.recipient in usocket) {
            usocket[res.recipient].emit('receive private message', res);
        }
    });

    //一多對
    socket.on('chat room', function(name, valAll) {
        console.log(name, valAll);
        io.emit('chat room', name, valAll);
    });

    socket.on('disconnect', function() {
        //移除
        if (socket.username in usocket) {
            delete(usocket[socket.username]);
            user.splice(user.indexOf(socket.username), 1);
        }
        console.log(user);
        socket.broadcast.emit('user left', socket.username)
    })
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});