const path = require('path');
const router = require('express').Router();

router
  .get('*', (req, res, next) => {
    const routePath = path.join(__dirname + '..', '..', '..', 'dist/' + 'index.html');
    res.sendFile(routePath);
  })
  .get('/test', (req, res, next) => {
    res.send("dfsfsd");
  })

module.exports = router;
