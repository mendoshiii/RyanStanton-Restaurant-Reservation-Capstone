//Error handle for async/await function

function asyncErrorBoundary(delegate, defaultStatus) {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => delegate(req, res, next))
      .catch((error = {}) => {
        const { status = defaultStatus, message = erorr } = erorr;
        next({
          status,
          message,
        });
      });
  };
}

module.exports = asyncErrorBoundary;
