const express = require('express');
const router = express.Router();

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const envy = require('./envy_dbapi');

envy.InitDB();

function sanitize(datarr) {
	for (var i = 0; i < datarr.length; i++) {
		datarr[i].img_url = DOMPurify.sanitize(datarr[i].img_url);
		datarr[i].tags = DOMPurify.sanitize(datarr[i].tags);
	}
	return datarr;
}

// Searches gender envy with tags and mode can be specific to AND or OR
router.get('/envysearch', (req, res) => {
	res.render('gayfrogs/envy/envysearch');
});

// POST handler
router.post('/envysearch', (req, res) => {
	const body = req.body;
	const tags = body.input2;
	const gender = body.dropdown;
	const mode = body.dropdown2;
	const hasNoTag = (tags == '');
	const hasNoGender = (gender == 'any');
	if (hasNoTag && hasNoGender) {
		res.redirect('./allenvy');
	} else if (!hasNoTag && hasNoGender) {
		res.redirect('./envytags?mode=' + mode + '&tags=' + encodeURIComponent(tags));
	} else if (hasNoTag && !hasNoGender) {
		res.redirect('./genderenvy?gender=' + gender);
	} else if (!hasNoTag && !hasNoGender) {
		res.redirect('./genderenvytags?gender=' + gender + '&mode=' + mode + '&tags=' + encodeURIComponent(tags));
	}
})

// Returns envy homepage
router.get('/envy', (req, res) => {
	res.status(200);
	res.render('gayfrogs/envy/envy');
});

// Returns the page for the user to upload envy
router.get('/makeenvy', (req, res) => {
	res.status(200);
	res.render('gayfrogs/envy/makeenvy');
});

// Handler for POST
router.post('/makeenvy', (req, res) => {
	const img_url = req.body.input1;
	const tags = req.body.input2;
	const gender = req.body.dropdown;

	// Process the form data
	res.status(envy.AddEnvy(img_url, envy.GENDER[gender], tags));

	res.send('Form submitted successfully!');
});

// Returns page for singular post
router.get('/envypost', (req, res) => {
	const body = req.query;
	let data = envy.GetPost(Number(body.id | 0));
	data = sanitize(data);
	res.render('gayfrogs/envy/envypost', { item: data[0] });
})

// Returns all envy, page specified with page query
router.get('/allenvy', (req, res) => {
	const body = req.query;
	let data = envy.GetAllPosts(Number(body.page | 0));
	res.render('gayfrogs/envy/envyposts', { items: data });
});

// Returns gender query specified envy, page specified with page query
router.get('/genderenvy', (req, res) => {
	const body = req.query;
	let data = envy.GetPostsGender(envy.GENDER[body.gender], Number(body.page | 0));
	res.render('gayfrogs/envy/envyposts', { items: data });
});

// Returns envy with tags and mode can be specific to AND or OR
router.get('/envytags', (req, res) => {
	const body = req.query;
	var data;
	if (body.mode == "AND") {
		data = envy.GetPostsAnd(body.tags, Number(body.page | 0));
	} else if (body.mode == "OR") {
		data = envy.GetPostsOr(body.tags, Number(body.page | 0));
	} else {
		data = [{
			id: 0,
			gender: 0,
			score: 0,
			img_url: 'empty',
			tags: ':3'
		}];
	}
	res.render('gayfrogs/envy/envyposts', { items: data });
});

// Returns gender envy with tags and mode can be specific to AND or OR
router.get('/genderenvytags', (req, res) => {
	const body = req.query;
	var data;
	if (body.mode == "AND") {
		data = envy.GetPostsGenderAnd(envy.GENDER[body.gender], body.tags, Number(body.page | 0));
	} else if (body.mode == "OR") {
		data = envy.GetPostsGenderOr(envy.GENDER[body.gender], body.tags, Number(body.page | 0));
	} else {
		data = [{
			id: 0,
			gender: 0,
			score: 0,
			img_url: 'empty',
			tags: ':3'
		}];
	}
	res.render('gayfrogs/envy/envyposts', { items: data });
});

module.exports = router;


