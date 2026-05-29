import mockAxios from "../services/mockAxios";
import React from "react";
import { courseModel } from "../models/course";
import "./styles.css"
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useAuth } from "../provider/DetailProvider";

const NewCourse = ()=>{
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({defaultValues: courseModel});
  const {user} = useAuth();

  const getContentArray = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const fileContent = fileReader.result;
      const contentArray = fileContent.split('\n').filter((line) => line.trim() !== '');
      setValue('contentArray', contentArray);
    };

    fileReader.readAsText(file);
  }

  const onSubmit = async (data) => {

    const formData = new FormData();

    formData.append('code', data.code);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('major', data.major);
    formData.append('instructor', data.instructor);
    formData.append('price', data.price);
    formData.append('availability', data.availability);
      // Append contentArray as individual items
  data.contentArray.forEach((content, index) => {
    formData.append(`contentArray[${index}]`, content);
  });

  // Append image file (if exists)
  if (data.image.length > 0) {
    formData.append('image', data.image[0]);
  }

  // Append contentFiles (if exists)
  Array.from(data.contentFiles).forEach(file => {
    formData.append('contentFiles', file);
  });
    console.log('Combined Data', formData);

    try {
            const response = await mockAxios.post(
              "/course/new-course",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  "Authorization": `Bearer ${user.authToken}`,
                },
              }
            );
            alert(`Course Added Successfully: ${response.data?.title}`);
          } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            alert(
              `Error: ${error.response ? error.response.data.message : error.message}`
            );
          };
  };

  return (
    <div>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="min-h-screen mx-4 bg-gray-300 px-32 py-16" enctype="multipart/form-data">
        <div className="border-2 border-black rounded-3xl w-full h-fit px-8 py-4 bg-white">
          <p className="nunito-sans-medium text-4xl w-full flex justify-center mb-8">New Course Details</p>
          <p className="dm-sans-medium text-2xl">Enter details for the new course being added!</p>

          <div className="my-4 flex flex-row gap-8">
            <label className="block dm-sans-light tracking-wide text-2xl font-bold">Code</label>
            <input {...register("code", { required: true })} className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100 " type="text" name="code" placeholder="e.g., HU-xxx" />
            {errors.code && <p>This field is required</p>}
          </div>

          <div className="mb-4 flex flex-row gap-8">
            <label className="block dm-sans-light tracking-wide text-2xl font-bold">Title</label>
            <input {...register("title", { required: true })} className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="text" name="title" placeholder="e.g., engineering" />
            {errors.title && <p>This field is required</p>}
          </div>
          
          <div className="md:flex mb-6">
            <div className="md:w-1/5">
              <legend className="block dm-sans-light tracking-wide text-2xl font-bold">Description</legend>
            </div>
            <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
              <textarea {...register("description", { required: true })} className="w-full shadow-inner p-4 border-[1px] border-black bg-slate-100" placeholder="Enter course description" rows="6" name="description"></textarea>
              {errors.description && <p>This field is required</p>}
            </div>
          </div>
          
          <div className="mb-4 flex flex-row gap-8">
            <label className="block dm-sans-light tracking-wide text-2xl font-bold">Major</label>
            <input {...register("major", { required: true })} className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="text" name="major" placeholder="Major" />
            {errors.major && <p>This field is required</p>}
          </div>
          
          <div className="mb-4 flex flex-row gap-8">
            <label className="block dm-sans-light tracking-wide text-2xl font-bold">Instructor</label>
            <input {...register("instructor", { required: true })} className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="text" name="instructor" placeholder="Name" />
            {errors.instructor && <p>This field is required</p>}
          </div>
          
          <div className="md:flex mb-4 flex flex-row justify-evenly gap-8">
            <div className="mb-4 flex flex-row gap-8 w-full">
              <label className="block dm-sans-light tracking-wide text-2xl font-bold">Price</label>
              <input {...register("price", { required: true , valueAsNumber: true })} className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="number" name="price" placeholder="e.g., 16.00$" />
              {errors.price && <p>This field is required</p>}
            </div>
            
            <div className="mb-4 flex flex-row w-full justify-center">
              <label className="block dm-sans-light tracking-wide text-2xl font-bold">Course Available?</label>
              <input {...register("availability")} className="justify-center h-full items-center flex p-4 border-2 border-black scale-150 mx-4 bg-slate-100" type="checkbox" name="availability" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="mb-4 flex-row flex gap-4">
              <label className="block dm-sans-light tracking-wide text-2xl font-bold">Course Contents File Selection</label>
              <input
              {...register("contentFile")}
              className="w-fit p-4 h-fit cursor-pointer"
              type="file"
              id="contentFile"
              name="contentFile"
              onChange={getContentArray}
              />
            </div>
            
            <div className="mb-4 flex-row flex gap-4">
              <label className="block dm-sans-light tracking-wide text-2xl font-bold">Course Title Photo Selection(.png, .jpg)</label>
              <input {...register("image")} className="w-fit p-4 h-fit cursor-pointer" type="file" id="image" name="image"/>
            </div>
            
            <div className="mb-4 flex-row flex gap-4">
              <label className="block dm-sans-light tracking-wide text-2xl font-bold">Select Content Files</label>
              <input {...register("contentFiles")} className="w-fit p-4 h-fit cursor-pointer" multiple type="file" id="contentFiles" name="contentFiles"/>
            </div>
          </div>
          
          <button type="submit" className="rounded px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white">Submit</button>
        </div>
      </form>
      <DevTool control={control}/>
    </div>
  );
};

// const NewCourse = () => {
//   const [course, setCourse] = useState(courseModel);

//   //React hook form methods which we are using in our code
//   const {register, handleSubmit, control} = useForm();

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     console.log(course);

//     if (!courseChecker({course:course})) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     const formData = new FormData();
//     for (let key in course) {
//       if (key === "contentFiles") {
//         course.contentFiles.forEach(file => formData.append("contentFiles", file));
//       } else if (key === "image") {
//         formData.append("image", course[key]);
//       } else if (key === "contentArray") {
//         const contentArrayJSON = JSON.stringify(course.contentArray);
//         formData.append("contentArray", contentArrayJSON);
//       } else {
//         formData.append(key, course[key]);
//       }
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/courses/new-course",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert(`Course Added Successfully: ${response.data}`);
//     } catch (error) {
//       console.error(error.response ? error.response.data : error.message);
//       alert(
//         `Error: ${error.response ? error.response.data.message : error.message}`
//       );
//     }
//   };

//   const handleChange = (event) => {
//     const { name, type, files, value } = event.target;

//     if (type === "file") {
//       if (name === "contentArray") {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const fileContents = e.target.result;
//           const chapters = parseFileContents(fileContents);
//           setCourse((prevCourse) => ({
//             ...prevCourse,
//             contentArray: chapters,
//           }));
//         };
//         reader.readAsText(files[0]);
//         return
//       } else if (name === "contentFiles") {
//         setCourse((prevCourse) => ({
//           ...prevCourse,
//           contentFiles: Array.from(files),
//         }));
//         return
//       } else if (name === "image") {
//         setCourse((prevCourse) => ({
//           ...prevCourse,
//           image: files[0],
//         }));
//         return
//       }
//     }

//     if(type === "checkbox"){
//       if(event.target.checked){
//         setCourse({
//           ...course,
//           availability: true
//         })
//       }
//       return
//     }

//     setCourse({
//       ...course,
//       [name]: value,
//     });
//   };

//   const parseFileContents = (fileContents) => {
//     const lines = fileContents.split("\n");
//     const chapters = [];

//     lines.forEach((line) => {
//       const match = line.match(/^chapter(\d+)\s(.*)/);
//       if (match) {
//         const chapterNumber = match[1];
//         const chapterName = match[2];
//         chapters.push(`${chapterNumber}: ${chapterName}`);
//       }
//     });

//     console.log(chapters)

//     return chapters;
//   };


//   return (
//     <div>
//       <form noValidate onSubmit={handleSubmit(onSubmit)} className="min-h-screen mx-4 bg-gray-300 px-32 py-16" encType="multipart/form-data">
//       <div className="border-2 border-black rounded-3xl w-full h-fit px-8 py-4 bg-white">
//         <p className="nunito-sans-medium text-4xl w-full flex justify-center mb-8">New Course Details</p>
//       <p className="dm-sans-medium text-2xl">Enter details for the new course being added!</p>
//       <div className="my-4 flex flex-row gap-8">
//         <label className="block dm-sans-light tracking-wide text-2xl font-bold">Code</label>
//         <input className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100 " type="text" name="code" placeholder="e.g., HU-xxx"  />
//         <input {...register("code")} className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100 " type="text" name="code" id="code" placeholder="e.g., HU-xxx" />
//       </div>
//       <div className="mb-4 flex flex-row gap-8">
//         <label className="block dm-sans-light tracking-wide text-2xl font-bold">Title</label>
//         <input {...register("title")} className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="text" name="title" placeholder="e.g., engineering" />
//       </div>
//       <div className="md:flex mb-6">
//         <div className="md:w-1/5">
//           <legend className="block dm-sans-light tracking-wide text-2xl font-bold">Description</legend>
//         </div>
//         <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
//           <textarea {...register("description")}  className="w-full shadow-inner p-4 border-[1px] border-black bg-slate-100" placeholder="Enter course description" rows="6" name="description"></textarea>
//         </div>
//       </div>
//       <div className="mb-4 flex flex-row gap-8">
//         <label className="block dm-sans-light tracking-wide text-2xl font-bold">Major</label>
//         <input  {...register("major")}  className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="text" name="major" placeholder="Major" />
//       </div>
//       <div className="mb-4 flex flex-row gap-8">
//         <label className="block dm-sans-light tracking-wide text-2xl font-bold">Instructor</label>
//         <input  {...register("instructor")}  className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="text" name="instructor" placeholder="Name" />
//       </div>
//       <div className="md:flex mb-4 flex flex-row justify-between gap-8">
//         <div className="mb-4 md:flex-1">
//           <label className="block dm-sans-light tracking-wide text-2xl font-bold">Price</label>
//           <input {...register("price")} className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="number" name="price" placeholder="e.g., 16.00$" />
//         </div>
//         <div className="mb-4 flex flex-row">
//           <label className="block dm-sans-light tracking-wide text-2xl font-bold">Course Available?</label>
//           <input {...register("availability")}  className="w-full justify-center h-full items-center flex p-4 border-2 border-black scale-50 mt-2 bg-slate-100" type="checkbox" name="availability" />
//         </div>
//       </div>
//       <div className="flex flex-row">
//         <div className="mb-4 flex-1">
//           <label className="block uppercase tracking-wide text-xs font-bold">Course Contents File Selection</label>
//           <input {...register("contentArray")}  className="w-fit shadow-inner p-4 border-2 border-slate-600 h-fit cursor-pointer" type="file" name="contentArray" />
//         </div>
//         <div className="mb-4 flex-1">
//           <label className="block uppercase tracking-wide text-xs font-bold">Course Title Photo Selection(.png, .jpg)</label>
//           <input {...register("image")} className="w-fit shadow-inner p-4 border-2 border-slate-600 h-fit cursor-pointer" type="file" name="image"/>
//         </div>
//         <div className="mb-4 flex-1">
//           <label className="block uppercase tracking-wide text-xs font-bold">Select Content Files</label>
//           <input {...register("contentFiles")} className="w-fit shadow-inner p-4 border-2 border-slate-600 h-fit cursor-pointer" multiple type="file" name="contentFiles" />
//         </div>
//       </div>
//       <button type="submit" className="rounded px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white">Submit</button>
//       </div>
//     </form>
//     <DevTool control={control}/>
//     </div>
//   );
// };

export default NewCourse;



// import axios from "axios";
// import React, { useState } from "react";
// import { courseChecker, courseModel } from "../models/course";
// import "./styles.css"

// const token = localStorage.getItem("token");

// const NewCourse = () => {
//   const [course, setCourse] = useState(courseModel);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log(course);

//     if (!courseChecker({course:course})) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     const formData = new FormData();
//     for (let key in course) {
//       if (key === "contentFiles") {
//         course.contentFiles.forEach(file => formData.append("contentFiles", file));
//       } else if (key === "image") {
//         formData.append("image", course[key]);
//       } else if (key === "contentArray") {
//         const contentArrayJSON = JSON.stringify(course.contentArray);
//         formData.append("contentArray", contentArrayJSON);
//       } else {
//         formData.append(key, course[key]);
//       }
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/courses/new-course",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert(`Course Added Successfully: ${response.data}`);
//     } catch (error) {
//       console.error(error.response ? error.response.data : error.message);
//       alert(
//         `Error: ${error.response ? error.response.data.message : error.message}`
//       );
//     }
//   };

//   const handleChange = (event) => {
//     const { name, type, files, value } = event.target;

//     if (type === "file") {
//       if (name === "contentArray") {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const fileContents = e.target.result;
//           const chapters = parseFileContents(fileContents);
//           setCourse((prevCourse) => ({
//             ...prevCourse,
//             contentArray: chapters,
//           }));
//         };
//         reader.readAsText(files[0]);
//         return
//       } else if (name === "contentFiles") {
//         setCourse((prevCourse) => ({
//           ...prevCourse,
//           contentFiles: Array.from(files),
//         }));
//         return
//       } else if (name === "image") {
//         setCourse((prevCourse) => ({
//           ...prevCourse,
//           image: files[0],
//         }));
//         return
//       }
//     }

//     if(type === "checkbox"){
//       if(event.target.checked){
//         setCourse({
//           ...course,
//           availability: true
//         })
//       }
//       return
//     }

//     setCourse({
//       ...course,
//       [name]: value,
//     });
//   };

//   const parseFileContents = (fileContents) => {
//     const lines = fileContents.split("\n");
//     const chapters = [];

//     lines.forEach((line) => {
//       const match = line.match(/^chapter(\d+)\s(.*)/);
//       if (match) {
//         const chapterNumber = match[1];
//         const chapterName = match[2];
//         chapters.push(`${chapterNumber}: ${chapterName}`);
//       }
//     });

//     console.log(chapters)

//     return chapters;
//   };


//   return (
//     <form onSubmit={handleSubmit} className="min-h-screen mx-4 bg-gray-300 px-32 py-16" encType="multipart/form-data">
//       <div className="border-2 border-black rounded-3xl w-full h-fit px-8 py-4 bg-white">
//         <p className="nunito-sans-medium text-4xl w-full flex justify-center mb-8">New Course Details</p>
//       <p className="dm-sans-medium text-2xl">Enter details for the new course being added!</p>
//       <div className="my-4 flex flex-row gap-8">
//         <label className="block dm-sans-light tracking-wide text-2xl font-bold">Code</label>
//         <input className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100 " type="text" name="code" placeholder="e.g., HU-xxx" onChange={handleChange} />
//       </div>
//       <div className="mb-4 flex flex-row gap-8">
//         <label className="block dm-sans-light tracking-wide text-2xl font-bold">Title</label>
//         <input className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="text" name="title" placeholder="e.g., engineering" onChange={handleChange} />
//       </div>
//       <div className="md:flex mb-6">
//         <div className="md:w-1/5">
//           <legend className="block dm-sans-light tracking-wide text-2xl font-bold">Description</legend>
//         </div>
//         <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
//           <textarea className="w-full shadow-inner p-4 border-[1px] border-black bg-slate-100" placeholder="Enter course description" rows="6" name="description" onChange={handleChange}></textarea>
//         </div>
//       </div>
//       <div className="mb-4 flex flex-row gap-8">
//         <label className="block dm-sans-light tracking-wide text-2xl font-bold">Major</label>
//         <input className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="text" name="major" placeholder="Major" onChange={handleChange} />
//       </div>
//       <div className="mb-4 flex flex-row gap-8">
//         <label className="block dm-sans-light tracking-wide text-2xl font-bold">Instructor</label>
//         <input className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="text" name="instructor" placeholder="Name" onChange={handleChange} />
//       </div>
//       <div className="md:flex mb-4 flex flex-row justify-between gap-8">
//         <div className="mb-4 md:flex-1">
//           <label className="block dm-sans-light tracking-wide text-2xl font-bold">Price</label>
//           <input className="w-full shadow-inner p-4 border-[1px] border-black h-2 bg-slate-100" type="number" name="price" placeholder="e.g., 16.00$" onChange={handleChange} />
//         </div>
//         <div className="mb-4 flex flex-row">
//           <label className="block dm-sans-light tracking-wide text-2xl font-bold">Course Available?</label>
//           <input className="w-full justify-center h-full items-center flex p-4 border-2 border-black scale-50 mt-2 bg-slate-100" type="checkbox" name="availability" onChange={handleChange} />
//         </div>
//       </div>
//       <div className="flex flex-row">
//         <div className="mb-4 flex-1">
//           <label className="block uppercase tracking-wide text-xs font-bold">Course Contents File Selection</label>
//           <input className="w-fit shadow-inner p-4 border-2 border-slate-600 h-fit cursor-pointer" type="file" name="contentArray" onChange={handleChange} />
//         </div>
//         <div className="mb-4 flex-1">
//           <label className="block uppercase tracking-wide text-xs font-bold">Course Title Photo Selection(.png, .jpg)</label>
//           <input className="w-fit shadow-inner p-4 border-2 border-slate-600 h-fit cursor-pointer" type="file" name="image" onChange={handleChange} />
//         </div>
//         <div className="mb-4 flex-1">
//           <label className="block uppercase tracking-wide text-xs font-bold">Select Content Files</label>
//           <input className="w-fit shadow-inner p-4 border-2 border-slate-600 h-fit cursor-pointer" multiple type="file" name="contentFiles" onChange={handleChange} />
//         </div>
//       </div>
//       <button type="submit" className="rounded px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white">Submit</button>
//       </div>
//     </form>
//   );
// };

// export default NewCourse;
