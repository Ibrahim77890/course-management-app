import mockAxios from "../services/mockAxios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/DetailProvider";

const Auth = () => {
  const { logIn } = useAuth();

  const navigate = useNavigate();
  const [login, setLogin] = useState(true);
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = login ? "/app/sign-in" : "/app/sign-up";

    try {
      const response = await mockAxios.post(url, formData);

      if (login) {
        const authToken = response.data.authToken;
        localStorage.setItem("token", authToken);
        if (response.status === 200 || response.status === 201) {
          alert("Login successful!");
        }
        logIn(response.data);
        const redirectTo = location.state?.from || "/home";
        navigate(redirectTo);
      }

      if (!login) {
        alert("Signup successful!");
        logIn(response.data);
        navigate("/home");
      }

      console.log(response.data); // Handle the response data as needed
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      // Optionally, alert the user on error
      alert(
        `Error: ${error.response ? error.response.data.message : error.message}`
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
      <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
          {login && "Login To Your Account"}
          {!login && "Sign Up Your Account"}
        </div>
        {login && (
          <button className="relative mt-6 border rounded-md py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-200">
            <span className="absolute left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500">
              <i className="fab fa-facebook-f"></i>
            </span>
            <span>Login with Google</span>
          </button>
        )}
        {login && (
          <div className="relative mt-10 h-px bg-gray-300">
            <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
              <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                Or Login With Email
              </span>
            </div>
          </div>
        )}
        <div className="mt-10">
          <form action="#" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-6">
              <label
                htmlFor="email"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                E-Mail Address:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>

                <input
                  id="email"
                  type="email"
                  name="email"
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="E-Mail Address"
                  onChange={handleChange}
                />
              </div>
            </div>
            {!login && (
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="username"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Username:
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <span>
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M16 9a4 4 0 11-8 0 4 4 0 018 0zm-2 0a2 2 0 11-4 0 2 2 0 014 0z"
                          clipRule="evenodd"
                        />
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12c0 2.09.713 4.014 1.908 5.542A8.986 8.986 0 0112.065 14a8.984 8.984 0 017.092 3.458A9 9 0 103 12zm9 9a8.963 8.963 0 01-5.672-2.012A6.992 6.992 0 0112.065 16a6.991 6.991 0 015.689 2.92A8.964 8.964 0 0112 21z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>

                  <input
                    id="username"
                    type="username"
                    name="username"
                    className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Username"
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {!login && (
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="role"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Role:
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <span>
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M16 9a4 4 0 11-8 0 4 4 0 018 0zm-2 0a2 2 0 11-4 0 2 2 0 014 0z"
                          clipRule="evenodd"
                        />
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12c0 2.09.713 4.014 1.908 5.542A8.986 8.986 0 0112.065 14a8.984 8.984 0 017.092 3.458A9 9 0 103 12zm9 9a8.963 8.963 0 01-5.672-2.012A6.992 6.992 0 0112.065 16a6.991 6.991 0 015.689 2.92A8.964 8.964 0 0112 21z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>

                  <input
                    id="role"
                    type="role"
                    name="role"
                    className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Role"
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col mb-6">
              <label
                htmlFor="password"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Password:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">
                  {login && "Login"}
                  {!login && "Sign Up"}
                </span>
                <span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center mt-6">
          <p
            className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center  cursor-pointer"
            onClick={() => setLogin(!login)}
          >
            <span>
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </span>
            <span className="ml-2">
              {login && "You don't have an account?"}
              {!login && "You have an account?"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
