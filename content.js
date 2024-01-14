function hashCode(s) {
  let hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

(function () {
  let JTHreturnValue = [];
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const nameTag = hashCode(heading.innerText);
    if (heading.innerText.length > 0) {
      const newAnchor = document.createElement('div');
      newAnchor.setAttribute('id', nameTag);
      heading.prepend(newAnchor);
      let level = heading.tagName.slice(-1);
      const headingText = heading.innerText;
      JTHreturnValue.push({ headingText, level, nameTag });
    }
  });
  chrome.runtime.sendMessage({ type: 'headings', value: JTHreturnValue });
})();
