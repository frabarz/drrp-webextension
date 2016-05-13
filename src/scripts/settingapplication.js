Promise.all([
	SettingStorage.get(),
	new Promise(function(resolve) {
		document.addEventListener('DOMContentLoaded', resolve);
	})
]).then(function(settings) {
	settings = settings[0];

	var target = document.querySelector('body');

	switch (settings.theme) {
		case 'ibuki':
			target.classList.add('ibukalipse');
			break;
	}

	if (settings.bullets_bgred)
		target.classList.add('red-bullet');

	if (settings.banner_paused)
		target.classList.add('banner-static');

	target = null;
});