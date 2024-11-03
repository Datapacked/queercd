const express = require('express');
const router = express.Router();

const kb = require('./dbapi');

kb.InitDB();

router.post('/addperson', (req, res) => {
	const body = req.query;
	kb.AddName(body.userID, body.name);
	res.status(200);
	res.send("Success");
});

router.post('/addkeyboardsmash', (req, res) => {
	const body = req.query;
	kb.AddKeyboardSmash(body.userID, body.text);
	res.status(200);
	res.send("Success");
});

router.get('/getpeople', (req, res) => {
	const body = req.query;
	res.status(200);
	res.send(kb.GetNames());
});

router.get('/getkeyboardsmashes', (req, res) => {
	const body = req.query;
	res.status(200);
	res.send(kb.GetKeyboardSmashes(body.userID, body.page));
});

router.get('/getallkeyboardsmashes', (req, res) => {
	const body = req.query;
	res.status(200);
	res.send(kb.GetAllKeyboardSmashes(body.page));
});

router.get('/getamounts', (req, res) => {
	res.status(200);
	res.send(kb.GetAmounts());
});

module.exports = router;


