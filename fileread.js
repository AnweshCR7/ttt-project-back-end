var request = require('request');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

app = express();
app.use(cors());
app.use(bodyParser.json()); //wasted an eternity on this!

app.post('/api', function(req, res) {

	//How many top occurrences are to be sent in the response.
	var truncate_number = req.body['number'];
	//console.log(req.bodyParser);
   
   	//making a get request to obtain the contents of the url as a string(i.e. body)
    request.get('http://terriblytinytales.com/test.txt', function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        occurrence_array = countWords(body);
	        //make a call to the function countWords (returns an array with descending order of word frequencies)
	        res.write(JSON.stringify(occurrence_array.slice(0, truncate_number)));
			res.end(); //end the response
	    }
	});

});

function countWords(content) {

//replacing the special characters and space characters in the body string, 
//converting them to lowercase and then splitting on " " to create a array of words
	var index = {},
      words = content
              .replace(/[.,?!;()"'-]/g, " ")
              .replace(/\s+/g, " ")
              .toLowerCase()
              .split(" ");

/*Create a Hashmap with words as properties and their corresponding counts as values*/
   	words.forEach(function (word) {
        if (!(index.hasOwnProperty(word))) {
            index[word] = 0;
        }
        index[word]++;
    });

    var occurrence_array = [], occurrence;

/*Converted hashmap to array for sorting*/
    for (var type in index) {
	    if (index.hasOwnProperty(type)) {
	        occurrence = {};
	        occurrence.word = type;
	        occurrence.count = index[type];
	        occurrence_array.push(occurrence);
    	}
	}
/*Sorted based on descending order of word frequencies*/
	occurrence_array.sort(function(a, b){ return b.count - a.count});

    return occurrence_array;
}


app.listen(3000, function (err) {
  if (err) {
    throw err
  }
  console.log('Server started on port 3000');
}) 
