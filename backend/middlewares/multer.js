import multer from "multer";
//helper
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits : {fileSize: 10 * 1024 * 1024} 
});

export default upload;
