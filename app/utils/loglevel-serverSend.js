//
//   /!\   a logger.setLevel(...) MUST be present AFTER this call in caller method
//

const loglevelServerSend = (logger, options) => {
  if (!logger || !logger.methodFactory) throw new Error('loglevel instance has to be specified in order to be extended');
  const _logger          = logger, 
        _url             = options && options.url || '/logs/save',
        _callOriginal    = options && options.callOriginal || true,
        _prefix          = options && options.prefix || ((logSev, message) => { return `${new Date().toLocaleString()} - ${logSev}: ${message}\n`; }),
        _level          = options && options.level,
        _originalFactory = _logger.methodFactory;
    
  _logger.methodFactory = function (methodName, logLevel, loggerName) {
    var rawMethod = _originalFactory(methodName, logLevel)

    return (message) => {
      const originalMessage = message;
      if (typeof _prefix === 'string')
        message = _prefix + message;
      else if (typeof _prefix === 'function')
        message = _prefix(methodName,message);
      else
        message = methodName + ': ' + message
                  
      if (_callOriginal);
        rawMethod(message);

      _sendNextMessage({ message: originalMessage, methodName, logLevel, _level, loggerName });
    }
  }
  // !!! _logger.setLevel(_level);  --> disable here --> MUST be present AFTER this call in caller !!!
  
  const _sendNextMessage = (jsonMessage) => {
    fetch(_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonMessage, null, 4),
    })
    .then((response) => {
      if (response && response.ok) { return; }
      const error = new Error('_sendNextMessage OK but returned nothing or an error (request: post /logs/save');
      error.name = 'ErrorCaught';
      throw (error);
    })
    .catch((error) => {
      console.error(error.message);
    });
  };
};

export default loglevelServerSend;