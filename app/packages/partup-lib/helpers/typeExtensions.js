/**
 * Partup type extensions
 */

/**
 * Convert a boolean string to a boolean value;
 * @name toBool
 * @return Boolean the boolean value of the string or undefined if not matched.
 */
String.prototype.toBool = function() {
  const str = charArrayToString(this);

  if (/^true/i.test(str)) {
    return true;
  }
  if (/^false/i.test(str)) {
    return false;
  }

  return undefined;
};

function charArrayToString(strArr) {
  return _.reduce(
    strArr,
    (total, index) => {
      return total + index;
    },
    ''
  );
}
