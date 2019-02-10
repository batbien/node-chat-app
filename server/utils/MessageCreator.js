
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
    message: `https://maps.google.com/maps?z=12&t=k&q=loc:${latitude}+${longitude}`,
    sentAt: new Date().getTime()
  };
};

module.exports = {createMessage, createLocationMessage};
