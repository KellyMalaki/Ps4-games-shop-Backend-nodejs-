const upload = require("../middleware/upload");
const express =require('express');
const router = express.Router();

router.post("/upload", upload.single('covers'), (req, res) =>{
    if(req.file === undefined){
        return res.send('You must select a file');
    }
    const imgUrl = `http://localhost:4000/covers/${req.file.filename}`;
    return res.send(imgUrl);
});

module.exports = router;