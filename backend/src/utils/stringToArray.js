module.exports = (str) => {
  return str.split(',').map(str => str.trim()).filter(str => !!str);
};