function customHeader(req,res, next)  {
    res.setHeader('X-Developed-By', 'Jubair')
    next()
}

module.exports = customHeader
