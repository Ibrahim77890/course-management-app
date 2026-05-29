const express = require("express");
const {
  postCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getPreviewCourse,
  putStatusToken,
  postFiles,
} = require("../controllers/course");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const upload = require("../middleware/multer");
const { requiredSignIn, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const uploadField = (req, res, next) => {
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "contentFiles", maxCount: 10 },
  ])(req, res, (err) => {
    if (err) {
      console.error("Error uploading:", err);
      return next(err);
    }
    next();
  });
};

const uploadFieldTest = (req, res, next) => {
  upload.fields([
    { name: "image", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      console.error("Error uploading:", err);
      return next(err);
    }
    next();
  });
};

router.route("/new-course")
  .post(
    requiredSignIn,
    // isAdmin,
    uploadField,
    postCourse
  );

//Get a course for preview
router.route("/:courseId").get(getPreviewCourse);

//Get a course details from a list
router.route("/:courseId/details").get(getCourse);

//Update a course
router.route("/:courseId/update").put(verifyTokenAndAdmin, updateCourse);

//Delete a course
router.route("/:courseId").delete(verifyTokenAndAdmin, deleteCourse);

//Route to get the status if course contains enrollment key or not
router.route("/enrollmentStatus").put(requiredSignIn, putStatusToken);

//Testing route for checking of cloudinary is working or not
router.route("/cloudinary").post(uploadFieldTest, postFiles);

module.exports = router;
