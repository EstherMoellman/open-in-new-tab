document.getElementById("add").addEventListener("click", function(){
  var hostname = document.getElementById("domain").value;
  var items = {};
  items[hostname] = hostname;
  chrome.storage.local.set(items);
});


document.getElementById("bookmark").addEventListener("change", (e) => {
    browser.browserSettings.openBookmarksInNewTabs.set({value: e.target.checked});
});

document.getElementById("searchBar").addEventListener("change", (e) => {
  browser.browserSettings.openSearchResultsInNewTabs.set({value: e.target.checked});
});

document.getElementById("urlBar").addEventListener("change", (e) => {
  browser.browserSettings.openUrlbarResultsInNewTabs.set({value: e.target.checked});
});

document.getElementById("newTabPosition").addEventListener("change", (e) => {
  browser.browserSettings.newTabPosition.set({value: document.getElementById("newTabPosition").value});
});

document.getElementById("requestBtn").addEventListener("click", getBrowserSettingPermission);

document.getElementById("revokeBtn").addEventListener("click", revokeBrowserSettingPermission);

hasBrowserSettingPermission().then((granted) => {
  if (granted) {
    browser.browserSettings.openBookmarksInNewTabs.get({}).then((setting) => {
      document.getElementById("bookmark").checked = setting.value;
    });

    browser.browserSettings.openSearchResultsInNewTabs.get({}).then((setting) => {
      document.getElementById("searchBar").checked = setting.value;
    });

    browser.browserSettings.openUrlbarResultsInNewTabs.get({}).then((setting) => {
      document.getElementById("urlBar").checked = setting.value;
    });

    browser.browserSettings.newTabPosition.get({}).then((setting) => {
      document.getElementById("newTabPosition").value = setting.value;
    });


    document.getElementById("revokeBtn").className = "";
  } else {
    document.getElementById("browserSettingForm").className = "hidden";
    document.getElementById("requestBtn").className = "";
  }
})


chrome.storage.local.get(null, function(items){
  for(var item in items){
    var listItem = document.createElement("span");
    var text = document.createTextNode(item);
    listItem.appendChild(text);
    var button = document.createElement("button");
    button.value = item;
    button.setAttribute("host", item);
    button.addEventListener('click', function(){
      chrome.storage.local.remove(this.getAttribute('host'));
      window.location.reload();
    });
    var buttonText = document.createTextNode(" remove");
    button.appendChild(buttonText);
    var div = document.createElement("li");
    div.appendChild(listItem);
    div.appendChild(button);
    document.getElementById("list").appendChild(div);
  }
});

async function hasBrowserSettingPermission() {
  const granted = await browser.permissions.contains({ permissions: ["browserSettings"] });
  return granted;
}

async function getBrowserSettingPermission(event) {
  try {
    const granted = await browser.permissions.request({permissions: ["browserSettings"]});
    return granted;
  } catch (e) {
    return false
  } finally {
    window.location.reload();
  }
}

async function revokeBrowserSettingPermission(event) {
  const granted = await browser.permissions.remove({ permissions: ["browserSettings"] });
  window.location.reload();
}
