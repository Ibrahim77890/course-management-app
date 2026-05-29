/*
Here i wanted to make routes for the user so I can keep track for his doings in his course,
I want to give details and contents of his course and then deliver the files which he is going to see
*/

const express = require("express");
const {
    verifyToken,
    verifyTokenAndAdmin,
  } = require("../middleware/verifyToken");
const { getUserCourses, getUserCourse, postUserCourse, updateUserCourse } = require("../controllers/userCourses");
const { requiredSignIn } = require("../middleware/authMiddleware");
const router = express.Router();


//Route to get all the courses and their respective information
router.route('/').get(verifyToken,getUserCourses);

//Get tracked info about a particular course of that user
router.route('/:courseId').get(requiredSignIn, getUserCourse);

//Add a new course information about a particular user
router.route('/add-new').post(requiredSignIn, postUserCourse);

//Update status of a particular content for user course tracking
router.route('/:courseId').put(verifyToken, updateUserCourse);

//Delete a particular course from list of courses of user
router.route('/:courseId').delete(verifyToken);


module.exports = router
