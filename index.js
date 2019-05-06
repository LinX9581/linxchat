var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MONGODB_URI = 'mongodb://admin:[your mlab password]@ds249311.mlab.com:49311/sockettest';
var identityKey = 'skey';
var users = require('./users').items;

//express setting -----------------------------------

//ejs
app.set('views', 'views/');
app.set('view engine', 'ejs');
//static file
app.use(express.static('public'));

//將 request進來的data 轉成 json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    name: identityKey,
    secret: 'linx', // 用来对session id相关的cookie进行签名
    store: new FileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
    resave: false, // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 1000 * 1000 // 有效期，单位是毫秒
    }
}));

app.get('/', function(req, res) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    console.log(sess);
    res.render('chat', {

    });
});

app.get('/ejs', function(req, res) {
    res.render('index', {

    });
});

//一對多
app.get('/all/', function(req, res) {
    res.sendFile(__dirname + '/index1.html');
});

//findUser function ---------------------------------------
var findUser = function(name, password) {
    return users.find(function(item) {
        return item.name === name && item.password === password;
    });
};

//chat function---------------------------------------------
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