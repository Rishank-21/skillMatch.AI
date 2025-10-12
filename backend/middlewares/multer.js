import multer from "multer";
//helper
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
