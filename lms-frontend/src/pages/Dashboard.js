import React, { useEffect, useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/DetailProvider";
import mockAxios from "../services/mockAxios";

const authToken = localStorage.getItem("token");

const UserCourse = ({ courseTitle, courseMajor, progress, handleClick }) => {
  return (
    <div className="bg-[#F6734A] h-full ubuntu-medium w-full flex rounded-md flex-col items-start p-5 justify-between mt-2">
      <div>
        <p>{courseTitle}</p>
        <p>Domain: {courseMajor}</p>
        <p>Progress: {typeof progress === "number" ? progress : 0}%</p>
      </div>
      <div className="flex justify-center items-center w-fit h-8">
        <div
          onClick={handleClick}
          className="px-4 pt-1 h-8 w-fit bg-black text-white"
        >
          Dive In!
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  //For redirecting to home page
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const { user } = useAuth();
  const handleRedirect = () => {
    navigate("/home");
  };

  useEffect(() => {
    if(!user) {
      navigate('/')
    }
    
    const fetchUserCourses = async () => {
      try {
        const response = await mockAxios.get("/my-courses", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response) {
          setMyCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchUserCourses();
  }, [navigate, user]);

  const handleClick = (courseId) => {
    navigate(`/home/course/${courseId}`);
  };

  return (
    <div className="h-screen w-screen flex flex-row bg-[#4B413E] gap-4 p-2 overflow-hidden">
      <div className="h-full w-2/5 flex flex-col p-2">
        {/* refresh button  */}
        <div
          onClick={handleRedirect}
          className="w-fit h-5 p-4 flex items-center border-white border-2 text-white hover:scale-110 hover:border-gray-500 hover:text-gray-500"
        >
          Home
        </div>

        {/* Progress Indicator on current going courses  */}
        <div className="w-full h-2/5 mt-5 flex flex-col p-2 overflow-auto">
          <h4 className="text-white">Your Current Progress</h4>

          <p className="w-fit text-black border-white bg-white p-2 my-2">
            Course
          </p>
          <div className="min-h-5 w-[45%] border-white border-3 bg-white rounded-full flex justify-center items-center">
            45%
          </div>

          <p className="w-fit text-black border-white bg-white p-2 my-2">
            Course
          </p>
          <div className="min-h-5 w-[45%] border-white border-2 bg-white rounded-full" />
        </div>
      </div>
      <div className="h-full w-3/5 flex flex-col">
        <div className="w-fit h-5 p-4 flex items-center border-white border-2 text-white">
          Touch
        </div>

        {/* Browse your courses here */}
        <div className="w-full h-4/5 gap-8 mt-5 grid grid-cols-2 flex-col px-4 py-2 overflow-auto">
          {myCourses?.map((item, index) => (
            <UserCourse
              key={index}
              courseTitle={item.title}
              courseMajor={item.major}
              handleClick={() => handleClick(item.courseId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
