const express = require('express');
const router = express.Router();

const envy = require('./envy_dbapi');

envy.InitDB();

router.get('/envy', (req, res) => {
    res.status(200);
    res.render('gayfrogs/envy/envy');
});

router.get('/makeenvy', (req, res) => {
	res.status(200);
	res.render('gayfrogs/envy/makeenvy');
});

router.post('/makeenvy', (req, res) => {
    const img_url = req.body.input1;
    const tags = req.body.input2;
    const gender = req.body.dropdown;

    // Process the form data (e.g., save to a database, send an email)
    console.log(img_url, tags, envy.GENDER[gender]);
    res.status(envy.AddEnvy(img_url, envy.GENDER[gender], tags));

    res.send('Form submitted successfully!');
});

router.get('/allenvy', (req, res) => {
    const body = req.query;
    res.send(envy.GetAllPosts(Number(body.page | 0)));
});

router.get('/genderenvy', (req, res) => {
    const body = req.query;
    res.send(envy.GetPostsGender(envy.GENDER[body.gender], Number(body.page | 0)));
});

module.exports = router;


