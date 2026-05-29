import React, { useState, useEffect } from "react";
import mockAxios from "../services/mockAxios";
import { useNavigate } from "react-router-dom";

const CourseListComponent = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        console.log("Clicked");
        navigate(`/home/course/${item._id}`);
      }}
      className="w-[300px] h-fit bg-white border-[#20385C] border-2 justify-self-center rounded-md flex flex-col shadow-xl hover:scale-[101%] p-4 gap-2 justify-evenly"
    >
      <img
        src={item?.image?.path}
        alt=""
        className="h-3/5 w-full object-cover"
      />
      <div className="flex flex-col px-2 pb-2">
        <p className="mb-2 block font-sans text-lg font-semibold leading-snug tracking-normal text-[#1c3150] antialiased">
          {item?.code}
        </p>
        <p className="mb-4 block font-sans text-base font-semibold uppercase leading-relaxed tracking-normal text-[#20385C] antialiased">
          {item?.title}
        </p>
        <p className="dm-sans-light">Teacher: {item?.instructor}</p>
      </div>
    </div>
  );
};

const CoursesList = ({ variant = "latest" }) => {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiUrls = {
          latest: "http://localhost:5000/courses/latest",
          free: "http://localhost:5000/courses/free",
          top: "http://localhost:5000/courses/top",
        };

        const responseString = apiUrls[variant];

        if (!responseString) {
          throw new Error(`Invalid variant: ${variant}`);
        }

        const response = await mockAxios.get(responseString);

        if (response && response.data && Array.isArray(response.data.courses)) {
          setCourses(response.data.courses);
        } else {
          throw new Error("No data found or data is not an array");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [variant]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full h-fit flex items-center overflow-auto gap-4 px-16 py-2 overflow-x-auto">
      {courses.length > 0 ? (
        courses.map((course, index) => (
          <CourseListComponent key={index} item={course} />
        ))
      ) : (
        <div>No courses found</div>
      )}
    </div>
  );
};

export default CoursesList;
