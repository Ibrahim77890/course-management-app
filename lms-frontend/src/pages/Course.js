import mockAxios from "../services/mockAxios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../provider/DetailProvider";

const authToken = localStorage.getItem("token");

const Course = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [enrollmentKey, setEnrollmentKey] = useState("");
  const [isEnrolled, setIsEnrolled] = useState({
    state: false,
    contents: null,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const contents = Array.isArray(course?.contents) ? course.contents : [];

  useEffect(() => {
    const coursePreviewDetails = async () => {
      try {
        const fetchedCourse = await mockAxios
          .get(`/course/${courseId}`,{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          })
          .then((response) => {
            return response;
          });
        setCourse(fetchedCourse.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    const courseDetails = async () => {
      try {
        const fetchedCourse = await mockAxios
          .get(`/course/${courseId}/details`,{headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },})
          .then((response) => {
            return response;
          });
        setCourse(fetchedCourse.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    const decider = async () => {
      try {
        const response = await mockAxios.get(
          `/my-courses/${courseId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("yes")
          courseDetails();
          setIsEnrolled({
            state: true,
            contents: response.data.contentItem,
          });
        } else if(response.status === 201) {
          console.log("no")
          coursePreviewDetails();
        } else {
          alert('Error fetching course details')
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    decider();
  }, [courseId]);

  const enrollingInCourse = async () => {
    try {
      const response = await mockAxios.post(
        "/cart/addToCart",
        { courseId },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
        }
      );
      if (response) {
        alert("Course Added to cart!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      alert("Error fetching course:", error.message);
    }
  };

  const enrolledInCourse = async () => {
    try {
      console.log("Clicked");

      const response = await mockAxios.put(
        "/course/enrollmentStatus",
        { courseId, key: enrollmentKey },
        {
          headers: {
            "Content-Type": "application/json", // Corrected the content type
            "Authorization": `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Enrollment key validated");

        const enrollmentResponse = await mockAxios.post(
          "/my-courses/add-new",
          { courseId },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          }
        );

        if (enrollmentResponse.status === 200) {
          setTimeout(() => {
            alert("You have been successfully added to this course");
          }, 2000);
        } else {
          alert("Failed to add the course. Please try again.");
        }
      } else {
        alert("Invalid enrollment key. Please check and try again.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert(
        `Error enrolling in course: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    }
  };

  const handleEnrollment = () => {
    if (user) {
      enrollingInCourse();
    } else {
      navigate("/", { state: { from: `/home/course/${courseId}` } });
    }
  };

  return (
    <div className="relative min-h-full w-screen bg-white overflow-hidden text-black">
      <div className="absolute top-0 left-0 w-full h-[55vh] bg-gradient-to-r from-[#20385C] to-[#121f32] z-[0]"></div>
      <div class="h-fit w-full relative flex items-start justify-center py-4 px-16 flex-row overflow-hidden">
        
        <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6 flex-1 mb-24">
          <div onClick={()=>{
            navigate('/home');
          }} className="p-2 text-white border-white border-2 rounded-lg w-fit cursor-pointer">Back to Courses</div>
          <div className="w-full h-28"></div>
          <div className="">
            <h1 class="text-6xl text-white dm-sans-bold font-semibold leading-tight lg:leading-snug mt-2">
              {course?.title}
            </h1>
          </div>
          <div className="w-full h-44"></div>
          <p className="text-3xl pt-12 pb-3 font-bold nunito-sans-medium">Description</p>
          <p className="ubuntu-light text-justify text-lg">{course?.description}</p>
          <p className="text-3xl pt-12 pb-3 nunito-sans-medium font-bold">Instructor</p>
          <p className="ubuntu-light text-justify pb-3 text-lg">{course?.instructor}</p>
          <p className="text-3xl pt-12 pb-3 nunito-sans-medium font-bold">Price</p>
          <p className="ubuntu-light text-justify pb-3 text-lg">{course?.price}</p>
          <p className="text-3xl pt-12 nunito-sans-medium font-bold">Course Contents</p>
          <table className="w-full h-fit mb-8">
            <thead>
              <tr>
                <th className="ubuntu-medium text-justify pb-3 text-xl">Chapter</th>
                <th className="ubuntu-medium text-justify pb-3 text-xl">Name</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((item, index) => (
                    <tr key={index}>
                      <td className="ubuntu-light text-justify pb-3 text-lg">{index + 1}</td>
                      <td className="ubuntu-light text-justify pb-3 text-lg">{item}</td>
                    </tr>
                  ))}

            </tbody>
          </table>

          {!isEnrolled.state && (
            <button
              onClick={() => handleEnrollment()}
              class="dark:bg-blue dark:hover:bg-gray-10 focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none"
            >
              <svg
                class="mr-3 text-white"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.02301 7.18999C7.48929 6.72386 7.80685 6.12992 7.93555 5.48329C8.06425 4.83666 7.9983 4.16638 7.74604 3.55724C7.49377 2.94809 7.06653 2.42744 6.51835 2.06112C5.97016 1.6948 5.32566 1.49928 4.66634 1.49928C4.00703 1.49928 3.36252 1.6948 2.81434 2.06112C2.26615 2.42744 1.83891 2.94809 1.58665 3.55724C1.33439 4.16638 1.26843 4.83666 1.39713 5.48329C1.52583 6.12992 1.8434 6.72386 2.30968 7.18999L4.66634 9.54749L7.02301 7.18999Z"
                  stroke="currentColor"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.66699 4.83333V4.84166"
                  stroke="currentColor"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.69 13.8567C14.1563 13.3905 14.4738 12.7966 14.6025 12.15C14.7312 11.5033 14.6653 10.8331 14.413 10.2239C14.1608 9.61476 13.7335 9.09411 13.1853 8.72779C12.6372 8.36148 11.9926 8.16595 11.3333 8.16595C10.674 8.16595 10.0295 8.36148 9.48133 8.72779C8.93314 9.09411 8.5059 9.61476 8.25364 10.2239C8.00138 10.8331 7.93543 11.5033 8.06412 12.15C8.19282 12.7966 8.51039 13.3905 8.97667 13.8567L11.3333 16.2142L13.69 13.8567Z"
                  stroke="currentColor"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.333 11.5V11.5083"
                  stroke="currentColor"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Enroll In Course
            </button>
          )}
          {!isEnrolled.state && (
            <div className="w-full h-5 mt-8 flex flex-col">
              <p className="ubuntu-medium">Enter Enrollment Key</p>
              <input
                value={enrollmentKey}
                onChange={(e) => setEnrollmentKey(e.target.value)}
                className="w-full p-3"
                placeholder="Enter encrypted key..."
              />
              <div
                onClick={enrolledInCourse}
                className="flex h-5 w-full justify-end items-end mt-8"
              >
                <p className="py-2 px-4 cursor-pointer bg-gray-800 text-white">
                  Enter
                </p>
              </div>
            </div>
          )}
          {isEnrolled.state && (
            <div className="w-full h-fit flex flex-col">
              <p className="text-3xl pt-12 nunito-sans-medium font-bold mb-8">Course Resouces</p>
              <div className="w-full h-fit gap-8 flex flex-col">
              {course?.files.map((file, index) => {
                return (
                  <div className="w-full h-10 flex flex-row gap-4" key={index}>
                    <p className="p-4 bg-green-200 rowdies-light h-fit w-fit">{index}</p>
                    <a
                      href={file.path}
                      download={file.originalName}
                      className="text-blue-700 ubuntu-light h-fit p-4 w-full bg-blue-200"
                    >
                      {file.originalName}
                    </a>
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>
        <div className="xl:w-2/6 lg:w-2/5 w-80 md:block flex justify-center items-center top-0 left-0 overflow-hidden">
          <img
            className="w-fit scale-[65%] rounded-xl"
            alt=""
            src={course?.image?.path}
          />
        </div>
      </div>
    </div>
  );
};

export default Course;
