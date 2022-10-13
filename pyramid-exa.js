var express = require('express');
var router = express.Router();


router.get('/', (req, res, next) =>{
   let data1, data2, data3, data4;
   doSomething(req.query.arg1, req.query.arg2)
   .then(_data1=>{
    data1 = _data1;
    return doAnotherThing(req.res.arg3, req.query.arg2, data1);
   })
   .then(_data2=>{
    data2 = _data2;
    return somethingCompletelyDifferent(req.res.arg1, req.query.arg42);
   })
   .then(_data3=>{
    data3 = _data3;
    return doSomethingElse();
   })
   .then(_data4=>{
    data4 = _data4;
    res.render('page', {data1, data2, data3, data4});
   })
  .catch(err => {next(err);});
});