# QUICK START  
npm i && node index.js

## Preview



## 功能分成左邊選單區、即時聊天區  

左邊選單 純手刻CSS 目前沒功能Q  

### 即時聊天區 
分成私聊和所有頻聊天  
Deploy on heroku  
You can check out [live preview](https://linxchat.herokuapp.com/)  

#### 簡易流程  

只要有人連上 
<pre>
socket.on('connect',function(){
    socket.emit('new user', name);  
    //就傳 'new user' 事件給sever
    //server會發送給除了自己以外的所有用戶
    //socket.broadcast.emit('user joined', username, (user.length - 1));
})
</pre>
  
收到server傳來的 'user joined' 訊息 就把其他成員的聊天室建立起來  
<pre>
socket.on('user joined', function(tname, index) {
    incomeHtml(tname, head)
});
</pre>
  
每次送出訊息會發 'send private message' 事件給server  
包括訊息詳細資料  
<pre>
var req = {
    'addresser': name,          //傳送者
    'recipient': recipient,     //接收者
    'type': 'plain',
    'body': val,
    'time': currentTime         //時間
}
</pre>
server 再發 'receive private message' 事件給 client  


#### 細部包括  
Mongodb local  
Mongolab cloud  
heroku 部屬  
訊息通知  
已讀訊息  
取得時間  
每次送出訊息 卷軸置底  
jquery 增減元素  
id md5 亂數  
