const { getDashboardDataFn} = require('../services/dashboardService');
const { handleResponse } = require('../utils/responseHandler');


const getDashboardData = async (req, res, next) => {
  
  try {
    const dashboardData = await getDashboardDataFn();

    handleResponse(res, 200, 'Dashboard data retrieved successfully', {dashboardData: dashboardData});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardData,
};
