function generateRandomNumber() {
  return Math.floor(Math.random() * 1000);
}

function isWhiteSpaceOnly(input_string) {
  return input_string.trim() === "";
}

function escapeHTMLCharacters(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/\\/g, "\\\\")
    .replace(/\$/g, "\\$");
}

function unescapeHTMLCharacters(str) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#96;/g, "`")
    .replace(/&amp;/g, "&")
    .replace(/\\\\/g, "\\")
    .replace(/\\\$/g, "$");
}

function checkForHTMLCharacters(str) {
  const htmlPattern = /&(lt|gt|quot|#39|#96|amp);|\\\\|/;
  return htmlPattern.test(str);
}

export {
  generateRandomNumber,
  isWhiteSpaceOnly,
  escapeHTMLCharacters,
  unescapeHTMLCharacters,
  checkForHTMLCharacters,
};
