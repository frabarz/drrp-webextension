(function(DR, document) {
	"use strict";

	if (
		RegExp("/r/danganronpa/", "i").test(location.href) &&
		!RegExp("class trial", "i").test(document.title)
	)
		return;

	function createSpriteButton(target) {
		var button = document.createElement("a");

		button.href = "#";
		button.className = "rl-button rl-insertsprite";
		button.textContent = "Sprite";

		target.appendChild(button);

		target = null;
		button = null;
	}

	function spriteSelectionHandler(evt) {
		if (evt.target.nodeName != "IMG") return;

		var index = 0,
			parent = document.querySelector(".rl-targetmenu .rl-formfinder").form,
			textarea = parent.querySelector(".usertext-edit textarea");

		if (textarea.textLength > 0) textarea.value += "\n\n";

		index = textarea.textLength;

		textarea.value +=
			"[A few words of the](" + evt.target.dataset.src + ") comment";
		textarea.focus();
		textarea.setSelectionRange(index + 1, index + 19), DR.hideHandbook();

		parent = null;
		textarea = null;
	}

	function removeLoadingGif() {
		this.classList.remove("loading");
		this.onload = null;
	}

	function spriteListReceiver(response) {
		var container = DR.handbook("SPRITE SELECTOR");
		container.classList.add("rl-spritemenu");

		var promises = [].concat(response.sprites).map(function(sprite) {
			return callBackground({
				type: "SPRITES_RESOLVE",
				uri: sprite
			}).then(src => ({ permanent: sprite, real: src }));
		});

		Promise.all(promises).then(function(sprites) {
			const fragment = document.createDocumentFragment();

			for (let src of sprites) {
				let img = new Image();

				img.className = "loading rl-sprite";
				img.onload = removeLoadingGif;
				img.src = src.real;
				img.dataset.src = src.permanent;

				fragment.appendChild(img);
			}

			container.querySelector(".body").appendChild(fragment);
			container.classList.add("visible");
			container = null;
		});
	}

	document
		.querySelectorAll(".bottom-area .rl-menu")
		.forEach(createSpriteButton);

	DR.addListener("insertsprite", spriteSelectionHandler);

	document.querySelector("body").addEventListener(
		"click",
		function(evt) {
			if (!evt.target.classList.contains("rl-insertsprite")) return;

			evt.preventDefault();
			evt.stopPropagation();

			var span = document.querySelectorAll(".rl-targetmenu"),
				n = span.length;
			while (n--) {
				span[n].classList.remove("rl-targetmenu");
			}

			evt.target.parentNode.classList.add("rl-targetmenu");

			callBackground({
				type: "SPRITES_GETLIST",
				character: DR.currentFlair,
				custom_sprites: DR.SPRITES[DR.currentId]
			}).then(spriteListReceiver);
		},
		true
	);

	function callBackground(message) {
		return new Promise(function(resolve) {
			chrome.runtime.sendMessage(message, resolve);
		});
	}
})(window.DRreddit, document);
