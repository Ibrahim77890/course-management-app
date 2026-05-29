import React, { useEffect, useState } from "react";
import "./styles.css";
import { useAuth } from "../provider/DetailProvider";
import mockAxios from "../services/mockAxios";
import { useNavigate } from "react-router-dom";

const authToken = localStorage.getItem("token");

const UserComponent = ({ user, userCourses }) => {
    return (
      <div className="w-full bg-white border-2 border-black gap-10 h-fit p-3 flex flex-row">
        <div className="h-fit">
          <p className="luckiest-guy-regular text-lg">Username: {user?.username}</p>
          <p className="font-sans luckiest-guy-regular text-lg">E-mail: {user?.email}</p>
        </div>
        <div className="flex-1 w-full flex flex-col gap-2 items-end">
            <p className="text-xl nunito-sans-medium">Courses Enrolled</p>
          {userCourses
            ?.filter((item) => item.userId === user._id)
            .map((filteredItem, index) => {
              return filteredItem.courses.map((course, idx) => (
                <div className="flex flex-row gap-4">
                  <p>{idx}. {course}</p>
                </div>
              ));
            })}
        </div>
      </div>
    );
  };
  

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await mockAxios.get(
          "/app/get-users",
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 200) {
          console.log(response.data.users);
          setUsers(response?.data?.users);
          try {
            const finalResponse = await mockAxios.get(
              "/courses/alldata",
              {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${authToken}`,
                },
              }
            );
            if (finalResponse.status === 200) {
              console.log(finalResponse.data.users);
              setCourses(finalResponse?.data?.users);
            } else {
              console.log("Error Here");
            }
          } catch (error) {
            alert("Error fetching courses of users data");
          }
        }
      } catch (error) {
        alert("Error fetching users data");
      }
    };

    fetchUsers();
  }, [user]);

  return (
    <div className="h-screen w-screen flex bg-[#20385C] p-10 overflow-hidden">
      <div className="bg-white p-4 flex flex-col h-full w-full">
        <div onClick={()=>{
            navigate('/home')
        }} className="p-3 rounded-lg cursor-pointer font-semibold border-2 border-[#20385C] w-fit text-[#20385C]">Back To Home</div>
        <p className="text-3xl w-full justify-center flex dm-sans-bold">
          Users of System
        </p>
        <div className="w-full h-24"></div>
        {/* list of all the active users of system */}
        <div className="w-full h-full overflow-auto gap-4 flex flex-col">
          {users?.map((item, index) => {
            return (
              <UserComponent key={index} user={item} userCourses={courses} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;
