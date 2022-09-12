const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;

const storage = new GridFsStorage({
    url: process.env.DB,
    options: {useNewUrlParser: true,useUnifiedTopology: true},
    file: (req, file) => {const match = ["image/png", "image/jpeg"];

    if(match.indexOf(file.mimetype) === -1){
        const filename = `cover-${file.originalname}`;
        return filename;
    }

    return{
        bucketName: "game-cover-images",
        filename: `cover-${file.originalname}`
    }

}
});
module.exports = multer({storage})