const throwError = (request, message = 'An error occurred', status = 500, err = new Error(message)) => {
    request.status = status || err.status || 500;
    request.type = 'html';
    request.body = '<p>Something <em>went poorly</em>. please, hope.</p><p>'+message+'</p>';
    request.app.emit('error', err, this);
};

module.exports = {
  throwError
};
