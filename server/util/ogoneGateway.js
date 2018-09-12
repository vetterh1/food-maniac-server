const logger = require('./logger.js');
const crypto = require('crypto');


// test with curl:
// curl --data "AMOUNT=123" http://localhost:8080/util/computeHash

export function computeHash(req, res) {
  if (!req.body || !req.body.AMOUNT || !req.body.CURRENCY || !req.body.ORDERID || !req.body.PSPID) {
    const error = { status: 'error', message: '! computeHash failed! - no body or missing parameter' };
    if (!req.body) error.message += '... no req.body!';
    if (req.body && !req.body.AMOUNT) error.message += '... no req.body.AMOUNT!';
    if (req.body && !req.body.CURRENCY) error.message += '... no req.body.CURRENCY!';
    if (req.body && !req.body.ORDERID) error.message += '... no req.body.ORDERID!';
    if (req.body && !req.body.PSPID) error.message += '... no req.body.PSPID!';
    res.status(400).json(error);
  } else {
    
    const hash = crypto.createHash('sha512');
    hash.on('readable', () => {
      const data = hash.read();
      if (data) {
        res.json({ code, details });
// !!!!!
        console.log(data.toString('hex'));
        // Prints:
        //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
      }
    });
    
    hash.write('some data to hash');
    hash.end();

  }
}


export function sendHashBackToClient(json) {
  request.post(
    "https://secure.ogone.com/ncol/test/orderstandard.asp",
    { json: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
  );
};
