var promise_load = new Promise(function(resolve) {
	document.addEventListener('DOMContentLoaded', resolve);
});

Promise.all([
	SettingStorage.get(),
	promise_load
]).then(function(settings) {
	settings = settings[0];

	var options = document.getElementById('options');

	options.theme.value = settings.theme || 'default';
	options.bullets_bgred.checked = checkBoolean(settings.bullets_bgred, 'true');
	options.banner_paused.checked = checkBoolean(settings.banner_paused, 'true');
	options.sprites_sourcelist.value = settings.sprites_sourcelist;

	options.addEventListener('submit', save_options, false);
});

function checkBoolean(bool, truth_value) {
	if (typeof bool == "boolean")
		return bool;
	else
		return bool == truth_value;
}

function save_options(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	var settings = {
		theme: this.theme.value,
		bullets_bgred: this.bullets_bgred.checked,
		banner_paused: this.banner_paused.checked,
		sprites_sourcelist: this.sprites_sourcelist.value
	};

	SettingStorage.set(settings)
		.then(function() {
			// Update status to let user know options were saved.
			document.getElementById('status').textContent = 'Options saved.';
			setTimeout(function () {
				document.getElementById('status').textContent = '';
			}, 750);
		});
}
