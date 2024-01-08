const multer = require("multer")
const path = require('path')
const upload = function(){

    const storage = multer.diskStorage({
        destination: "../images",
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
          }
    })
    
    const upload = multer({
        storage: storage,
        limits: {fileSize: 1000000}
    }).single('image')
    return upload;
}

module.exports = {upload};