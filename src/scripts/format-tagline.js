(function(DR, document) {
	"use strict";

	if (
		RegExp("/r/danganronpa/", "i").test(location.href) &&
		!RegExp("class trial", "i").test(document.title)
	)
		return;

	DR.addListener("rolesidentified", function(roles) {
		requestAnimationFrame(function() {
			document
				.querySelectorAll(
					".thing.self > .entry .tagline, .thing.comment > .entry .tagline"
				)
				.forEach(taglineFormatter);
		});

		function computeLocalTime() {
			let here = new Date(),
				there = new Date(
					here.getTime() +
						(here.getTimezoneOffset() + this.dataset.offset * 60) * 60 * 1000
				);

			this.title =
				"Right now it's " + there.toLocaleString() + " in their time zone.";
		}

		function taglineFormatter(tagline) {
			if (tagline.classList.contains(CLASSNAMES.COMMENT_TAGLINE)) return;

			var author = tagline.querySelector(".author") || {},
				character = roles.get(author.textContent);

			if (!character) return;

			tagline.classList.add(CLASSNAMES.COMMENT_TAGLINE);

			var charlabel = document.createElement("em");
			charlabel.classList.add("userattrs");
			charlabel.classList.add(CLASSNAMES.COMMENT_CHARACTERNAME);
			charlabel.textContent = DR.NAMES[character];

			tagline.insertBefore(charlabel, author.nextSibling);

			if (roles.hasTz(author.textContent)) {
				var offset = document.createElement("em");
				offset.classList.add("userattrs");
				charlabel.classList.add(CLASSNAMES.COMMENT_LOCALTIME);
				offset.textContent = "[" + roles.getUTCLabel(author.textContent) + "]";
				offset.dataset.offset = roles.getTz(author.textContent);
				offset.addEventListener("mouseenter", computeLocalTime, true);

				tagline.insertBefore(offset, charlabel.nextSibling);
			}

			var flair = tagline.querySelector(".flair"),
				flair_class = DR.FLAIRS[character];

			if (!flair) {
				flair = document.createElement("span");
				tagline.insertBefore(flair, author);
			}

			if (flair_class && flair_class.indexOf("flair-external") != 0)
				flair.className = "flair " + flair_class;
		}
	});
})(window.DRreddit, document);
