const { loginUser, registerUser, refreshTokens, revokeRefreshToken} = require('../services/authService');
const { handleResponse } = require('../utils/responseHandler');
const { setCookie } = require('../utils/cookieUtils');



const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = await registerUser(name, email, password);
    handleResponse(res, data.statusCode, 'User Registration Successfully', null);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, statusCode, accessToken, refreshToken } = await loginUser(email, password);
    setCookie(res, 'refreshToken', refreshToken);
    handleResponse(res, statusCode, 'User Login Successfully', { accessToken, user });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } = await refreshTokens(refreshToken);
    setCookie(res, 'refreshToken', newRefreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    revokeRefreshToken(refreshToken);
    res.clearCookie('refreshToken');
  }
  res.json({ message: 'Logged out successfully' });
};


module.exports = {
  register,
  login,
  refreshToken,
  logout
};
