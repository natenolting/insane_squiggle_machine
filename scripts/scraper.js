// var w = 2400
// var h = 3000
// var page = require('webpage').create();
//
// //viewportSize being the actual size of the headless browser
// page.viewportSize = { width: w, height: h };
// //the clipRect is the portion of the page you are taking a screenshot of
// page.clipRect = { top: 0, left: 0, width: w, height: h };
// //the rest of the code is the same as the previous example
// page.open('http://127.0.0.1:53878/sketch_220616_coloring_book/', function() {
//   console.log('Get the page');
//   page.render(`capture.jpg`);
//   phantom.exit();
// });


// var page = require('webpage').create();
// //viewportSize being the actual size of the headless browser
// page.viewportSize = { width: 2400, height: 3000 };
// //the clipRect is the portion of the page you are taking a screenshot of
// page.clipRect = { top: 0, left: 0, width: 2400, height: 3000 };
// //the rest of the code is the same as the previous example
// page.open('http://127.0.0.1:53878/sketch_220616_coloring_book/', function() {
//   page.render('render.png');
//   phantom.exit();
// });
//


var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko)';
page.viewportSize = { width: 2400, height: 3000 };
page.clipRect = { top: 0, left: 0, width: 2400, height: 3000 };
var fs = require('fs');
page.open('http://127.0.0.1:53878/sketch_220616_coloring_book/', function(status) {
    console.log('Page load status: ' + status);
    if (status === 'success') {
        window.setTimeout(function(){
            //fs.write('example.html', page.content, 'a');
            page.render('render.png');
            console.log('render saved');
            phantom.exit();
        }, 60000);
    }
});
