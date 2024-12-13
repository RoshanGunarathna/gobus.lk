const { loginUser, registerUser , refreshAccessToken } = require('../services/authService');
const { handleResponse } = require('../utils/responseHandler');



const register = async (req, res, next) => {
  try {
    

    const { name, email, password} = req.body;
    
    const data = await registerUser(name, email, password );
    
    handleResponse(res, data.statusCode, 'User Registration Successfully', null);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
   
    const { email, password } = req.body;
    const { user , statusCode, accessToken, refreshToken} = await loginUser(email, password);

    // Send refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Use true in production with HTTPS
        sameSite: 'strict',
    });
    handleResponse(res, statusCode, 'User Login Successfully', {accessToken, user});
  } catch (err) {
    next(err);
  }
};

const refreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  try {
      const newAccessToken = refreshAccessToken(refreshToken);
      res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
      authService.revokeRefreshToken(refreshToken);
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
