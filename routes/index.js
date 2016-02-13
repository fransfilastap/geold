var express = require('express');
var router = express.Router();

/* Dashboard page. */
router.get('/', function(req, res, next) {
    res.render('dashboard', {layout: false});
});

module.exports = router;