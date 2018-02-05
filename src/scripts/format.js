"use strict";

document.addEventListener("DOMContentLoaded", executeFormat, true);

var uri_appspot = RegExp("r-drrp\\.appspot\\.com"),
	uri_showdown = RegExp("mymjF4AZJrg|#rebuttal"),
	uri_https = RegExp("i.imgur.com|media.tumblr.com"),
	uri_continue = RegExp("reddit.com/r/w+/comments/[a-z0-9]+/w+/[a-z0-9]+"),
	uri_ignored = RegExp(
		[
			"#ignore",
			".json",
			"youtu.?be",
			"discord",
			"redd.it/",
			"reddit.com/",
			"localhost"
		].join("|")
	);

function executeFormat() {
	if (
		RegExp("/r/danganronpa/", "i").test(location.href) &&
		!RegExp("class trial", "i").test(document.title)
	)
		return;

	document.body.classList.add(CLASSNAMES.RLACTIVE);

	// Transform the H2 nodes in P nodes, in thread comments.
	document.querySelectorAll(".thing.comment h2").forEach(function(h2) {
		let paragraph = document.createElement("p");

		for (let kid = h2.firstChild; kid; kid = kid.nextSibling)
			paragraph.appendChild(kid);

		h2.parentNode.replaceChild(paragraph, h2);
	});

	// Format system messages
	document
		.querySelectorAll(".thing.comment .usertext-body blockquote")
		.forEach(function(blockquote) {
			if (blockquote.classList.contains(CLASSNAMES.COMMENT_SYSMESSAGE)) return;

			let sysmsg = RegExp(
				"(?:added|updated|deleted|removed) (?:to|in|from) (?:your|the) truth bullets?",
				"i"
			);

			if (sysmsg.test(blockquote.textContent)) {
				blockquote.parentNode.classList.add(CLASSNAMES.DIALOGUE);
				blockquote.classList.add(CLASSNAMES.COMMENT_SYSMESSAGE);
			}
		});

	// Insert sprites for comments loaded dynamically
	document.querySelectorAll(".morecomments a.button").forEach(function(button) {
		if (button.classList.contains(CLASSNAMES.SCANNED)) return;

		button.classList.add(CLASSNAMES.SCANNED);
		button.classList.add(CLASSNAMES.BUTTON_FORMATLISTENING);
		button.addEventListener(
			"click",
			function() {
				// I know. But there's no other way.
				setTimeout(executeFormat, 3000);
			},
			true
		);
	});

	document
		.querySelectorAll(".thing.self, .thing.comment")
		.forEach(function(thing) {
			if (thing.classList.contains(CLASSNAMES.SCANNED)) return;
			thing.classList.add(CLASSNAMES.SCANNED);

			loadSprites(thing);
			requestAnimationFrame(function() {
				highlightNewComments(thing);
			});
		});
}

function highlightNewComments(thing) {
	let time =
		thing.querySelector(".edited-timestamp") ||
		thing.querySelector(".live-timestamp");

	if (time) {
		let last_update = sessionStorage.getItem(thing.dataset.fullname);
		let current = new Date(time.getAttribute("datetime")).getTime();

		if (current > last_update) {
			thing.classList.add("new-comment");
			sessionStorage.setItem(thing.dataset.fullname, current);
		}
	}

	thing = null;
}

function loadSprites(thing) {
	let comment = thing.querySelector(".entry .md");
	if (!comment) return;

	// The actual formatter
	let paragraphs = comment.querySelectorAll("p");

	for (let paragraph of paragraphs) {
		let anchors = paragraph.querySelectorAll("a");

		for (let anchor of anchors) {
			let uri = anchor.href.trim();

			if (!uri) continue;

			// REBUTTAL SHOWDOWN!
			if (uri_showdown.test(uri)) {
				thing
					.querySelector(".entry")
					.classList.add(CLASSNAMES.COMMENT_SHOWDOWN);
				continue;
			}

			// IGNORED URL PATTERNS
			if (uri_ignored.test(uri)) continue;

			// if (uri_continue.test(uri)) {
			// 	paragraph.classList.add(CLASSNAMES.COMMENT_COMESFROM);
			// 	continue;
			// }

			normalizeImageSource(anchor.href)
				.then(loadImage)
				.then(function(image) {
					return anchor.hash == "#evidence"
						? loadEvidenceImage.call(image, anchor, paragraph)
						: loadSpriteImage.call(image, anchor, paragraph);
				});
		}
	}

	function callBackground(message) {
		return new Promise(function(resolve) {
			chrome.runtime.sendMessage(message, resolve);
		});
	}

	function normalizeImageSource(uri) {
		let url = new URL(uri);

		if (uri_appspot.test(uri)) {
			return callBackground({
				type: "SPRITES_RESOLVE",
				uri: uri.toString()
			});
		}

		// Ensure certain domains are loaded through https
		if (uri_https.test(uri)) {
			url.protocol = "https:";
			uri = url.toString();
		}

		// Normalize Wikia images
		if (uri.indexOf(".wikia.") > -1) {
			uri = uri.replace(/revision\/latest.+$/, "").replace(/\/$/, "");
		}

		return Promise.resolve(uri);
	}

	function loadImage(src) {
		return new Promise(function(resolve, reject) {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = () => reject(image);
			image.src = src;
			if (image.complete) image.onload();
		});
	}
}

function loadSpriteImage(a, p) {
	p.parentNode.classList.add(CLASSNAMES.DIALOGUE);

	p.classList.add(CLASSNAMES.STATEMENT);

	let hr = document.createElement("hr");
	hr.classList.add(CLASSNAMES.STMNTSPLIT);
	a.parentNode.insertBefore(hr, a);

	this.classList.add(CLASSNAMES.SPRITE_ROOT);
	if (this.naturalHeight / this.naturalWidth > 0.75)
		this.classList.add(CLASSNAMES.SPRITE_VERTICAL);
	a.parentNode.insertBefore(this, a);

	this.onload = null;
	this.onerror = null;
}

function loadEvidenceImage(a, p) {
	p.parentNode.classList.add(CLASSNAMES.DIALOGUE);

	this.classList.add(CLASSNAMES.EVIDENCE);
	p.parentNode.insertBefore(this, p.nextSibling);

	this.onload = null;
	this.onerror = null;
}
