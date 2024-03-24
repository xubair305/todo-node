const file = require('fs');

function logUser(req, res, next) {

    const log = { "timestamp": Date.now(), "url": req.url, "method": req.method, "ip_address": req.ip }

    file.appendFile('./log.txt', `${JSON.stringify(log)}\n`, (err) => {
        if (err) res.json(400).send({"error": "Something wrong"})
        else next()
    })


}


module.exports = logUser