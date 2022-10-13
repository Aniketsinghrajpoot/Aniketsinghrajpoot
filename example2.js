var express = require('express');
var app = express();

async function wait (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  });
}

app.get('/', async function(req, res){
  console.log('before wait', new Date());
  await wait(5 * 1000);
  console.log('after wait', new Date())
  res.send('hello world');
});

app.listen(3000, err => console.log(err ? "Error listening" : "Listening"));


