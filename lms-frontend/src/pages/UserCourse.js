import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import mockAxios from "../services/mockAxios";
import { useAuth } from "../provider/DetailProvider";

const UserCourse = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await mockAxios.get("/my-courses");
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, [navigate, user]);

  return (
    <div className="h-screen w-screen flex gap-8 flex-col bg-gray-300 overflow-auto px-8">
      <p
        onClick={() => navigate("/dashboard")}
        className="mt-8 text-gray-800 font-semibold cursor-pointer mb-8 ubuntu-medium"
      >
        Dashboard
      </p>
      <p className="ubuntu-medium text-6xl">My learning space</p>
      <p className="ubuntu-medium text-4xl">Courses you are enrolled in</p>
      <div className="h-fit w-full flex flex-col border-black border-2 ubuntu-regular p-0 bg-white">
        {courses.length === 0 && (
          <div className="p-6 text-lg">You are not enrolled in any course yet.</div>
        )}
        {courses.map((course) => (
          <div key={course.courseId} className="flex flex-row border-b border-black justify-between px-4 py-3">
            <div>
              <p className="font-semibold">{course.title}</p>
              <p>Domain: {course.major}</p>
              <p>Instructor: {course.instructor}</p>
              <p>Progress: {course.progress}%</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/home/course/${course.courseId}`)}
              className="px-4 py-2 bg-black text-white"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCourse;
