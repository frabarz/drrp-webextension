chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var req = new XMLHttpRequest();
    req.open('GET', 'sprites.json', true);

    req.onload = function() {
        var lista = JSON.parse(this.response);

        console.log(lista[request.character]);

        sendResponse({
            sprites: lista[request.character]
        });
    };

    req.send();

    return true;
});