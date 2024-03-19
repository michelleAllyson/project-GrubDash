function notFound(request, response, next) {
  next({ status: 405, message: `Path not found: ${request.originalUrl}` });
}

module.exports = notFound;
