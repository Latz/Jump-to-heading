document.addEventListener('DOMContentLoaded', () => {
  visibilityChanged();
});

document.addEventListener('visibilitychange', () => {
  visibilityChanged();
});

function visibilityChanged() {
  if (document.visibilityState == 'visible') {
    activatedTab();
    chrome.tabs.onActivated.addListener(activatedTab);
    chrome.tabs.onUpdated.addListener(updatedTab);
  } else {
    chrome.tabs.onActivated.removeListener(activatedTab);
    chrome.tabs.onUpdated.removeListener(updatedTab);
  }

  function activatedTab() {
    chrome.runtime.sendMessage({
      type: 'watch-tab',
    });
  }
  function updatedTab(tabId, changeInfo, tabInfo) {
    if (changeInfo?.status == 'complete') {
      chrome.runtime.sendMessage({
        type: 'watch-tab',
        value: changeInfo,
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  visibilityChanged();
});

document.addEventListener('visibilitychange', () => {
  visibilityChanged();
});

function bold(txt, level) {
  if (level == 1) return `<b class="bigger">${txt}</b>`;
  else return txt;
}

let headingsIterator;
// -------------------------------------------------------------------
function anchor(txt, nameTag) {
  txt = `<a href="#${nameTag}">${txt}</a>`;
  return txt;
}
// -------------------------------------------------------------------
function headingsToList(list, level) {
  let heading = headingsIterator.next();
  if (heading.done) {
    return list;
  }

  if (heading.value.level > level) {
    while (heading.value.level > level) {
      list += '<ul>';
      level++;
    }
  }
  if (heading.value.level < level) {
    while (heading.value.level < level) {
      list += '</ul>';
      level--;
    }
  }
  let txt = bold(heading.value.headingText);
  txt = anchor(txt, heading.value.nameTag);
  list += `<li>${bold(txt, level)}</li>`;
  return headingsToList(list, level);
}
// -------------------------------------------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == 'headings') {
    document.getElementById('headings').textContent = '';

    // Display message if not headings were found
    if (message.value.length == 0) {
      document.getElementById('headings').innerHTML = 'No headings found';
    } else {
      // create unsorted HTML list
      headingsIterator = message.value[Symbol.iterator]();
      const list = headingsToList('', 0);
      document.getElementById('headings').innerHTML = list;

      // send message to background script if a heading is clicked
      headings.addEventListener('click', (event) => {
        const id = event.target.hash.substring(1);
        chrome.runtime.sendMessage({
          type: 'anchor',
          id,
        });
      });
    }
  }
});
