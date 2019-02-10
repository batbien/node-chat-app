
const createMessage = (sender, message) => {
  return {
    sender: sender,
    message: message,
    sentAt: new Date().getTime()
  };
};

const createLocationMessage = (sender, latitude, longitude) => {
  return {
    sender: sender,
    message: `https://map.google.com?q=${latitude},${longitude}`,
    sentAt: new Date().getTime()
  };
};

module.exports = {createMessage, createLocationMessage};
