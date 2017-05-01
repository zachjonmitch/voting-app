const express = require('express');
const app = express();
const path = require('path');
const routes = require('./server/routes/app.js');
const PORT = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('client'));
app.use(routes);

app.use((req, res) => {
      res.status(400).status(500).render('error');
});
      
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});