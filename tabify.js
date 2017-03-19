function addTarget() {
	var elements = document.getElementsByTagName("a");
	for (var e of elements) {
		e.setAttribute("target", "_blank");
		e.setAttribute("rel", "nofollow");
	}
}

function filter(hostname) {
	chrome.storage.local.get(null, function(items){
		for(var item in items){
			console.log(item);
			if(item == hostname){
				addTarget();
			}
		}
	});
}

var url = new URL(window.location.href);
filter(url.hostname);

