  const _sendNextMessage = (jsonMessage, _url) => {
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


//
//   /!\   a logger.setLevel(...) MUST be present AFTER this call in caller method
//

const loglevelServerSend = (logger, options) => {
  if (!logger || !logger.methodFactory) throw new Error('loglevel instance has to be specified in order to be extended');
  const _logger = logger;
  const _url = (options && options.url) || '/logs/save';
  const _callOriginal = (options && options.callOriginal) || true;
  const _prefix = (options && options.prefix) || ((logSev, message) => { return `${new Date().toLocaleString()} - ${logSev}: ${message}\n`; });
  const _level = options && options.level;
  const _originalFactory = _logger.methodFactory;

  _logger.methodFactory = (methodName, logLevel, loggerName) => {
    const rawMethod = _originalFactory(methodName, logLevel);

    return (message) => {
      const originalMessage = message;
      let modifiedMessage = message;
      if (typeof _prefix === 'string') modifiedMessage = _prefix + message;
      else if (typeof _prefix === 'function') modifiedMessage = _prefix(methodName, message);
      else modifiedMessage = `${methodName}: ${message}`;

      if (_callOriginal);
        rawMethod(modifiedMessage);

      _sendNextMessage({ message: originalMessage, methodName, logLevel, _level, loggerName }, _url);
    };
  };
  // !!! _logger.setLevel(_level);  --> disable here --> MUST be present AFTER this call in caller !!!
};

export default loglevelServerSend;