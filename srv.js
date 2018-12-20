var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 2555;
var mysql = require('mysql'); 
var id = 0;

var con = mysql.createConnection({
  host: "localhost",
  user: "usr",
  password: "pass",
  database: "test"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.on('chat', function(msg){

	var sql = "INSERT INTO msg(id, message) VALUES (?,?)";

	  con.query(sql, [id,msg],function (err, result) {
		  id++;
	    if (err) throw err;
	    console.log("1 record inserted");
 	 });

	  con.query("SELECT * FROM msg", function (err, result, fields) {
   		 if (err) throw err;
    		console.log(result);
    		io.emit('chat', result);
  		});
	    
	  });
		
});


http.listen(port, function(){
	console.log('listening on' + port);
});