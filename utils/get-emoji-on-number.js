const getEmojiOnNumber = (number) => {
  if (number === 1) {
    return `:one:`;
  }

  if (number === 2) {
    return `:two:`;
  }

  if (number === 3) {
    return `:three:`;
  }

  if (number === 4) {
    return `:four:`;
  }

  return `:five:`;
};

module.exports = getEmojiOnNumber;