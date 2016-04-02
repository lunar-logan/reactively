var express = require('express');

var Mookit = require('../lib/mookit');

var router = express.Router();
var mookit = new Mookit({});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.post('/', function (req, res, next) {
    mookit.authenticate(req.body, function (d) {
        if (!d) {
            res.json({code: -1, msg: "Not authorized"});
        } else {
            res.json({code: 0, msg: d});
        }
    });

});

module.exports = router;
