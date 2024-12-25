
const setCookie = (res, name, value, options = {}) => {
    const defaultOptions = {
        httpOnly: true, // Prevent access by JavaScript
        secure: true, // Use secure cookies in production
        path: '/',
        ...options, // Allow overriding default options
    };
    res.cookie(name, value, defaultOptions);
};

module.exports = { setCookie };
