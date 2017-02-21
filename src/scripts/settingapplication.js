document.addEventListener('DOMContentLoaded', function () {
	requestAnimationFrame(function () {
		SettingStorage.get().then(loadSettings);
		injectSettingsButton();
	});

	function loadSettings(settings) {
		let target = document.querySelector('body');

		switch (settings.theme) {
			case 'ibuki':
				target.classList.add('ibukalipse');
				break;
		}

		if (settings.bullets_bgred)
			target.classList.add('red-bullet');

		if (settings.banner_paused)
			target.classList.add('banner-static');
	}

	function injectSettingsButton() {
		let button = document.createElement('a');
		button.className = 'rl-settingsbutton';
		button.title = 'Class Trial Helper Settings';
		button.addEventListener('click', function (evt) {
			evt.preventDefault();
			evt.stopPropagation();

			chrome.runtime.sendMessage({ openSettings: true });
		}, true);

		let target = document.querySelector('#header span.user');
		target.parentNode.insertBefore(button, target.nextElementSibling);
	}
}, false);
