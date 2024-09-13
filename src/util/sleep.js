module.exports.sleep = function (ms = 1) {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
};
