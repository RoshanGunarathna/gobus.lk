
const setCookie = (res, name, value, options = {}) => {
    const defaultOptions = {
        httpOnly: true, // Prevent access by JavaScript
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Prevent cross-site cookie usage
        ...options, // Allow overriding default options
    };
    res.cookie(name, value, defaultOptions);
};

module.exports = { setCookie };
