const logger = require('./logger.js');
const crypto = require('crypto');

const passphrase = "6fadeee8-d1b3-4ebe-b744-32f8e2d48689";


// test with curl:
// curl -d "AMOUNT=123" -d "ORDERID=ordertest" -d "CURRENCY=EUR" -d "PSPID=VETTERH1"   http://localhost:8080/util/computeHash


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

    // Function called when hash is ready (hash start is AFTER this function)
    hash.on('readable', () => {
      const data = hash.read();
      if (data) {
        const hashResult = data.toString('hex');
        console.log("Data hashed: ", hashResult);

        // Sent to the browser so it can be sent to Ogone... 
        res.json({ hashResult });
      } else {
        const error = { status: 'error', message: '! computeHash failed! - data emtpy' };
        res.status(400).json(error);
      }
    });
    
    const dataToHash = `AMOUNT=${req.body.AMOUNT}${passphrase}CURRENCY=${req.body.CURRENCY}${passphrase}ORDERID=${req.body.ORDERID}${passphrase}PSPID=${req.body.PSPID}${passphrase}`;
    console.log("Data to hash: ", dataToHash);

    hash.write(dataToHash);
    hash.end();

  }
}
