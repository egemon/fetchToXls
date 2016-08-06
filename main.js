var json2xls = require('json2xls');
var fs = require('fs');
var q = require('q');
var request = require('request-promise');
var codes = require('./codes.json');

// fs.readFile('./codes.txt', 'utf8', function (err, file) {
  // console.log('File: ', file);
// });

// curl -H "Content-Type: application/json" -X POST -d '{"who": "30019801", "from": "2014-01-01", "to": "2016-08-06"}' 'http://www.007.org.ua/api/transactions'


// var options = {
//   url: 'http://www.007.org.ua/api/transactions',
//   method: 'POST',
//   json: true,
//   body: {
//     "who": "30019801",
//     "from": "2014-01-01",
//     "to": "2016-08-06"
//   }
// };

// for (var i = 0; i < codes.length; i++) {
// }

var requests = [];
for (var i = 0; i < codes.length; i++) {
  var code = codes[i];
  var options = {
    url: 'http://www.007.org.ua/api/transactions',
    method: 'POST',
    json: true,
    body: {
    	"who": '' + code,
    	"from": process.argv[2],
    	"to": process.argv[3]
    }
  };
  requests.push(request.post(options));
}

q.all(requests).then(handleResponses);

function handleResponses (responses) {
  for (var i = 0; i < codes.length; i++) {
    var code = codes[i];
    var xls = json2xls(responses[i]);
    fs.writeFileSync( code + '.xlsx', xls, 'binary');
  }
}