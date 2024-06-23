let flag = false;

module.exports.getFlag = () => flag;

module.exports.enableFlag = () => {
  flag = true;
};

module.exports.disableFlag = () => {
  flag = false;
};
