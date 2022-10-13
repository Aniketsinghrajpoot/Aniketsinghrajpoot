var express = require('express');
var router = express.Router();


router.get('/', (req, res ,next) =>{
    doSomething(req.query.arg1, req.query.arg2, (err,data1) =>{
        if(err) return next(err);
        doAnotherThing(req.query.arg3, req.query.arg2, data1,(err,data2) =>{
            if(err2) return next(err2);
            doSomethingCompletelyDifferent(req.query.arg1, req.query.arg4, (err3, data3) =>{
                if(err3) return next(err3);
            doSomethingElse((err4, data4) =>{
                if(err4) return next(err4);
                res.render('page', {data1, data2, data3, data4});
             
            });
            });;
        });
    });
});


//promiss

// function asyncFunction(arg1, arg2){
//     return new Promise((resolve, reject) =>{
//         if(errorDetected) return reject(dataAbutError);
//         resolve(theResult);
//     });
// }


//new promiss

// function readFile(filename){
//     return new PerformanceObserverEntryList((resolve, reject) =>{
//         FileSystem.readFile(filename,(err, data)=>{
//             if(err) reject(err);
//             else resolve(data);
//         });
//     });
// }








