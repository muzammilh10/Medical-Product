const multer = require("multer");
const path = require("path");

const directory = path.join(__dirname, "..", "public/imageMedical");

const uploadPhoto = (req, res, next) => {
  // this variable is to specify where image must be stored
  // and with what name image must be stored
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, directory);
    },
    filename: (req, file, cb) => {
        // console.log(req.files)
      const ext = file.mimetype.split("/")[1];
      cb(null, `medicine-${req.body.name}-${Date.now()}.${ext}`);
    },
  });

  // this varible is to check whether user uploads image only
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only image", 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  }).  fields([
    { name: "name", maxCount: 10 },
    { name: "productName", maxCount: 10 },
    { name: "expiryDate", maxCount: 10 },
    { name: "image", maxCount: 10 },
  ]);
  


  // 
  // .single("image");

  upload(req, res, (err) => {
    if (err) {
      return next(new Error(err));
    }
    next();
  });
};

module.exports = uploadPhoto;