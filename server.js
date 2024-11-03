const express = require('express');
// const https = require('https');
const fs = require('fs');
const PORT = 27576;

// var key = fs.readFileSync(__dirname + '/certs_donotuse/selfsigned.key');
// var cert = fs.readFileSync(__dirname + '/certs_donotuse/selfsigned.crt');
// var options = {
//   key: key,
//   cert: cert
// };

const compression = require('compression');
const app = express();

app.use(express.static(__dirname + '/public'));

app.use(compression());

const gayfrogs = require('./gayfrogs');
app.use('/gayfrogs',  gayfrogs);


app.set('view engine', 'ejs');

app.set('views', 'pages');

app.get('/', (req, res) => {
	res.status(200);
	res.send("Hello :3");
});

// var server = https.createServer(options, app);

app.listen(PORT, () => {
	console.log(`Server online at http://localhost:${PORT}`);
});
