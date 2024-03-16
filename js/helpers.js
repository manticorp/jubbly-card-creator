import './../sass/app.scss';
import markdownit from 'markdown-it';
import './helpers';

/**
 * Convert a string to snake_case
 * @param  {string} str Arbitrary string
 * @return {string}     snake_case_string
 */
window.snakeCase = function snakeCase (str) {
  return str ? str.toLowerCase().replace(' ', '_') : '';
};

/**
 * Make the first character of string Uppercase
 * @param  {string} str Arbitary string
 * @return {string}     String with first character uppercase
 */
window.ucfirst = function ucfirst (str) {
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert a string to Title Case
 * @param  {string} str Arbitrary string
 * @return {string}     Title Case String
 */
window.titleCase = function titleCase (str) {
  return str.split(' ')
    .map(ucfirst)
    .join(' ');
};

/**
 * Slug a string - lowercasing and replacing space with -
 * @param  {string} str Arbitrary string
 * @return {string}     slugged-string
 */
window.slug = function slug (str) {
  return str ? str.toLowerCase().replace(' ', '-') : '';
};

/**
 * Parses a string as markdown, allowing html
 * @param  {string} str     Markdown string
 * @param  {object} options Any options to pass to markdownit
 * @return {string}         Resulting html
 */
window.markdownParse = function markdownParse (str, options) {
  str = str.replace('//', '\n\n');
  const md = markdownit(Object.assign({ html: true }, options ?? {}));
  str = md.render(str);
  return str;
};

/**
 * Shuffle an array
 * @param  {array} arr Arbitrary array
 * @return {array}     Shuffled array
 */
window.shuffle = function shuffle (arr) {
  const arr2 = [...arr];
  shuffleIn(arr2);
  return arr2;
};

/**
 * Shuffle an array in place
 * @param  {array} arr Arbitrary array
 */
window.shuffleIn = function shuffleIn (arr) {
  let currentIndex = arr.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex], arr[currentIndex]];
  }
};

/**
 * Escape string for safe inclusion in html
 * @param  {string} unsafe Unescaped string
 * @return {string}        Escaped string
 */
window.escapeHtml = function escapeHtml (unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

window.isNumeric = function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

window.parseVersion = function parseVersion(v) {
  return v.split('.').map(a => parseInt(a));
};
window.isVersionHigherOrSame = function isVersionHigherOrSame(v1, v2) {
  return v1 === v2 || isVersionHigher(v1, v2);
};
window.isVersionHigher = function isVersionHigher(v1, v2) {
  v1 = parseVersion(v1);
  v2 = parseVersion(v2);
  if (v2[0] > v1[0]) return false;
  if (v2[0] < v1[0]) return true;
  if (v2[1] > v1[1]) return false;
  if (v2[1] < v1[1]) return true;
  if (v2[2] > v1[2]) return false;
  if (v2[2] < v1[2]) return true;
  return false;
};

window.numberWithOptionalUnits = function numberWithOptionalUnits (number, defaultUnits) {
  if (isNumeric(number)) {
    return `${number}${defaultUnits}`;
  }
  return number;
};

window.naturalCompare = function naturalCompare (a, b) {
  // Extract the prefix and the number from each string
  const prefixA = a.match(/^\D+/)[0];
  const prefixB = b.match(/^\D+/)[0];
  const numA = a.match(/\d+$/)[0];
  const numB = b.match(/\d+$/)[0];

  // Compare the prefixes first, using the default locale and case-insensitive
  const prefixCompare = prefixA.localeCompare(prefixB);

  // If the prefixes are equal, compare the numbers, using numeric sorting
  if (prefixCompare === 0) {
    return numA.localeCompare(numB, undefined, { numeric: true });
  }

  // Otherwise, return the prefix comparison result
  return prefixCompare;
};
