(function() {
	"use strict";

	// if ( !RegExp("fanfiction", "i").test(document.querySelector('.content .sitetable .thing .title').textContent) )
	// 	return;

	var v, vid,
		code, startTime,
		vids = document.querySelectorAll('.content a[href*="youtube.com"], .content a[href*="youtu.be"]');

	for (v = 0; v < vids.length; v++) {
		vid = vids[v];
		code = parseCode(vid.href);

		if (code) {
			startTime = parseStartTime(vid.href);

			if (startTime) {
				if ( startTime[1] )
					startTime = 60 * parseInt(startTime[1]) + parseInt(startTime[2]);
				else
					startTime = parseInt(startTime[2]);
			}

			vid.parentNode.insertBefore(createPlayer(code, startTime), vid.nextSibling);
		}
	}

	function parseCode(url) {
		var match;

		match = (/youtube\.com\/watch\?.*v=([^&\#]+)/).exec(url);
		if (match)
			return match[1];

		match = (/youtu\.be\/([^\?\#]+)/).exec(url);
		if (match)
			return match[1];

		match = (/youtube.com\/embed\/([^\?\#]+)/).exec(url);
		if (match)
			return match[1];
	}

	function parseStartTime(url) {
		var match;

		match = (/(?:start|from|t)\=(?:(\d+)m)?(\d+?)s/).exec(url);
		if (match)
			return match;
	}

	function createPlayer(code, startTime) {
		var url = 'https://www.youtube.com/embed/' + code + '?',
			frame = document.createElement('iframe');

		if (startTime)
			url += 'start='+ startTime +'&';

		frame.setAttribute('width', '120');
		frame.setAttribute('height', '36');
		frame.setAttribute('frameborder', '0');
		frame.setAttribute('style', 'float:right');
		frame.src = url + 'rel=0&autohide=0&showinfo=0&fs=0&disablekb=1';

		return frame;
	}

})();