
/**
 * Transform some stuff in the HTML.
 *
 *  - turn emoji into relevant classes on their containers
 *
 * @param  {[type]} html [description]
 */
module.exports = function transformHTML (html, cb) {
	
	// td.yes
	// td.notyet.no
	// td.never

	// - :white_check_mark: - supported feature
	//  - :white_large_square: - feature not yet implemented for this transport
	//  - :heavy_multiplication_x: - unsupported feature due to protocol restrictions
	//  

	var JQUERY = require('jquery');

	// first argument can be html string, filename, or url
	require('jsdom').env(html, function (errors, window) {
		if (errors) return cb(errors);
		
		var $ = JQUERY(window);

		//
		// Replace text nodes and add CSS class(es)
		// 
		
		$('td:contains("white_check_mark")').addClass('yes');
		$('td:contains("white_check_mark")').text('');

		$('td:contains("white_large_square")').addClass('no').addClass('notyet');
		$('td:contains("white_large_square")').text('');

		$('td:contains("heavy_multiplication_x")').addClass('never');
		$('td:contains("heavy_multiplication_x")').text('');

		// Convert transformed HTML into a string and send it back
		var transformedHTML = window.document.documentElement.outerHTML;
		cb(null, transformedHTML);
	});

}