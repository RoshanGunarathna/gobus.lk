const { loginUser, registerUser } = require('../services/authService');
const { handleResponse } = require('../utils/responseHandler');

const generateToken = (user, secret, expiresIn) => {
  return jwt.sign({ id: user._id, role: user.role, name: user.name }, secret, { expiresIn });
};


const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw   errors.array();
    const { name, email, password, role } = req.body;
    
    const data = await registerUser(name, email, password, role );
    
    handleResponse(res, data.statusCode, 'User Registration Successfully', data);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
   
    const { email, password } = req.body;
    const data = await loginUser(email, password );
    handleResponse(res, data.statusCode, 'User Login Successfully', data);
  } catch (err) {
    next(err);
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Not authenticated" });

  try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const newAccessToken = generateToken(decoded, process.env.JWT_SECRET, "15m");
      res.json({ accessToken: newAccessToken });
  } catch (error) {
      res.status(401).json({ message: "Invalid refresh token" });
  }
};



module.exports = {
  register,
  login,
  refreshToken,
};
