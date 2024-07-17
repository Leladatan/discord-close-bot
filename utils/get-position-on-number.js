const getPositionOnNumber = (number) => {
  if (number === 1) {
    return 'Легкая';
  }

  if (number === 2) {
    return 'Центральная';
  }

  if (number === 3) {
    return 'Сложная';
  }

  if (number === 4) {
    return 'Частичная поддержка';
  }

  return 'Полная поддержка';
};

module.exports = getPositionOnNumber;