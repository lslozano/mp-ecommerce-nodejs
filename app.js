var express = require('express');
var exphbs  = require('express-handlebars');

const mercadopago = require ('mercadopago');

mercadopago.configure({
    sandbox: true,
    access_token: ''
});

   
var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    const { img, title, price, unit } = req.query
    let preference = {
      items: [
        {
          "picture_url": img,
          "title": title,
          "unit_price": Number(price),
          "quantity": Number(unit)
        }
      ]
    };
    mercadopago.preferences.create(preference)
    .then(function(response){
       global.init_point = response.body.init_point;
       res.render('detail', {img, title, price, unit, id: response.body.id})
    }).catch(function(error){
      console.log(error);
    });
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(3000);