const multer = require("multer")
const path = require('path')
const upload = function(){

    const storage = multer.diskStorage({
        destination: "./public/image",
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
          }
    })
    
    const upload = multer({
        storage: storage,
        limits: {fileSize: 5000000}
    }).single('image')
    return upload;
}

module.exports = {upload};