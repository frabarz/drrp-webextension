(function(DR, document) {
	"use strict";

	if (
		RegExp("/r/danganronpa/", "i").test(location.href) &&
		!RegExp("class trial", "i").test(document.title)
	)
		return;

	function createMentionButton(target) {
		var button = document.createElement("a");

		button.href = "#";
		button.className = "rl-button rl-insertmention";
		button.textContent = "Mention";

		target.appendChild(button);

		target = null;
		button = null;
	}

	function userSelectionHandler(evt) {
		var target = evt.target;

		if (target.matches(".rl-mention span")) target = target.parentNode;

		if (!target.matches(".rl-mention")) return;

		var index = 0,
			character = target.querySelector(".character-name").textContent,
			user = target.querySelector(".user-name").textContent,
			parent = document.querySelector(".rl-targetmenu .rl-formfinder").form,
			textarea = parent.querySelector(".usertext-edit textarea");

		if (
			textarea.textLength > 0 &&
			textarea.value.substr(textarea.textLength - 1, 1) != " "
		)
			textarea.value += " ";

		index = textarea.textLength;

		textarea.value += character + "^^" + user + " ";
		textarea.focus();
		textarea.setSelectionRange(index, index + character.length);

		DR.hideHandbook();

		parent = null;
		textarea = null;
	}

	DR.addListener("insertmention", userSelectionHandler);

	DR.addListener("rolesidentified", function(roles) {
		Array.prototype.forEach.call(
			document.querySelectorAll(".bottom-area .rl-menu"),
			createMentionButton
		);

		document.querySelector("body").addEventListener(
			"click",
			function(evt) {
				if (!evt.target.classList.contains("rl-insertmention")) return;

				evt.preventDefault();
				evt.stopPropagation();

				var span = document.querySelectorAll(".rl-targetmenu"),
					n = span.length;
				while (n--) {
					span[n].classList.remove("rl-targetmenu");
				}

				evt.target.parentNode.classList.add("rl-targetmenu");

				var container = DR.handbook("MENTION SELECTOR");
				container.classList.add("rl-mentionmenu");

				var user, char, item;

				for (n = 0; n < DR.NAMES.length; n++) {
					user = roles.get(n);
					char = roles.get(user);

					if (user && char && char == n) {
						item = document.createElement("a");
						item.className = "rl-mention";

						span = document.createElement("span");
						span.className = "flair " + DR.FLAIRS[n];
						item.appendChild(span);

						span = document.createElement("span");
						span.className = "character-name";
						span.textContent = DR.NAMES[n];
						item.appendChild(span);

						span = document.createElement("span");
						span.className = "user-name";
						span.textContent = "/u/" + user;
						item.appendChild(span);

						container.querySelector(".body").appendChild(item);
					}
				}

				container.classList.add("visible");
				container = null;
			},
			true
		);
	});
})(window.DRreddit, document);
