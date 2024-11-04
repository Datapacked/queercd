const express = require('express');
const router = express.Router();

const newsFolder = 'pages/gayfrogs/news';
const fs = require('fs');

const NEWS_FILES = {files: []};

fs.readdir(newsFolder, (err, files) => {
	files.forEach(item => {
		if (item.endsWith('.ejs') || item.endsWith('.html')) {
			NEWS_FILES.files.push(item);
		}
	})
});

const keyboardsmash = require('./keyboard_smash');
router.use('/keyboardsmash',  keyboardsmash);

const envy = require('./envy');
router.use('/envy', envy);

// Reload articles
router.get('/reload', (req, res) => {
	NEWS_FILES.files = [];
	fs.readdir(newsFolder, (err, files) => {
		files.forEach(item => {
			if (item.endsWith('.ejs') || item.endsWith('.html')) {
	NEWS_FILES.files.push(item);
			}
		})
	});
	res.status(200);
	res.render('gayfrogs/index');
});

// Define your routes here
router.get('/', (req, res) => {
	res.status(200);
	res.render('gayfrogs/index');
});

router.get('/flavor', (req, res) => {
	res.status(200);
	res.render('gayfrogs/flavor');
});

router.get('/news', (req, res) => {
	res.status(200);
	res.render('gayfrogs/news', {items: NEWS_FILES.files});
});

router.get('/minecraft', (req, res) => {
	res.status(200);
	res.render('gayfrogs/minecraft');
});

router.get('/news/*', (req, res) => {
	// Handle the request here
	// You can access the requested path using req.url
  
	const newsPage = req.url.split('/')[2]; // Extract the "page1" part
	/* res.send(`This is news page: ${newsPage}`); */
	res.render(`gayfrogs/news/${decodeURI(newsPage)}`);
});

// Export the router object
module.exports = router;
