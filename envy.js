const express = require('express');
const router = express.Router();

const envy = require('./envy_dbapi');

envy.InitDB();

router.get('/makeenvy', (req, res) => {
	res.status(200);
	res.render('gayfrogs/makeenvy');
});

router.post('/makeenvy', (req, res) => {
    const img_url = req.body.input1;
    const tags = req.body.input2;
    const gender = req.body.dropdown;

    // Process the form data (e.g., save to a database, send an email)
    console.log(img_url, tags, envy.GENDER[gender]);

    res.send('Form submitted successfully!');
});

module.exports = router;


