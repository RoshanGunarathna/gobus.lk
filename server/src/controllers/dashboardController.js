const { getDashboardDataForAdminFn, getDashboardDataForOperatorFn} = require('../services/dashboardService');
const { handleResponse } = require('../utils/responseHandler');


const getDashboardDataForAdmin = async (req, res, next) => {
  
  try {
    const dashboardData = await getDashboardDataForAdminFn();

    handleResponse(res, 200, 'Dashboard data retrieved successfully', {dashboardData: dashboardData});
  } catch (err) {
    next(err);
  }
};

const getDashboardDataForOperator = async (req, res, next) => {
  
  try {
    const dashboardData = await getDashboardDataForOperatorFn();

    handleResponse(res, 200, 'Dashboard data retrieved successfully', {dashboardData: dashboardData});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardDataForAdmin,
  getDashboardDataForOperator
};
