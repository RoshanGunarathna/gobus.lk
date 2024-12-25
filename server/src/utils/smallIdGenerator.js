

const generateSmallId = (text) => {
    const timestamp = Date.now().toString().slice(-3); 
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 random digits
    return `${text}-${timestamp}${randomDigits}`; 
  };
  

module.exports = { generateSmallId };

