import {
  addCourseToCart,
  addNewCourse,
  authenticateUser,
  checkoutCart,
  enrollWithKey,
  enrollCourseDirect,
  getAdminReport,
  getCartSummary,
  getCoursePreview,
  getLatestCourses,
  getFreeCourses,
  getTopCourses,
  getMyCourses,
  getSessionUser,
  getLastCheckout,
  registerUser,
  searchCourses,
  isCourseEnrolled,
  findCourseById,
} from "./localStore";

const parseCourseId = (url, suffix = "") => {
  const cleanUrl = String(url || "").split("?")[0].replace(/^https?:\/\/[^/]+/, "");
  const source = suffix ? cleanUrl.replace(suffix, "") : cleanUrl;
  return source.split("/").filter(Boolean).pop();
};

const success = (data, status = 200) => Promise.resolve({ status, data });

const failure = (message, status = 400) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return Promise.reject(error);
};

const extractPayload = async (payload) => {
  if (typeof FormData === "undefined" || !(payload instanceof FormData)) {
    return payload || {};
  }

  const values = {};
  for (const [key, value] of payload.entries()) {
    if (key === "image" && value && typeof value === "object") {
      if (typeof File !== "undefined" && value instanceof File) {
        values.imageFile = value;
      }
      continue;
    }

    if (key === "contentFiles" && value && typeof value === "object") {
      values.contentFiles = values.contentFiles || [];
      values.contentFiles.push(value);
      continue;
    }

    if (key.startsWith("contentArray[")) {
      values.contentArray = values.contentArray || [];
      values.contentArray.push(value);
      continue;
    }

    values[key] = value;
  }

  return values;
};

const routeResponse = async (method, url, payload = {}, config = {}) => {
  const normalizedUrl = String(url || "").replace(/^https?:\/\/[^/]+/, "");
  const currentUser = getSessionUser();

  if (method === "get" && normalizedUrl === "/app/me") {
    return success({ user: currentUser });
  }

  if (method === "post" && normalizedUrl === "/app/sign-in") {
    return success(authenticateUser(payload));
  }

  if (method === "post" && normalizedUrl === "/app/sign-up") {
    return success(registerUser(payload), 201);
  }

  if (method === "get" && normalizedUrl === "/courses/latest") {
    return success({ courses: getLatestCourses() });
  }

  if (method === "get" && normalizedUrl === "/courses/free") {
    return success({ courses: getFreeCourses() });
  }

  if (method === "get" && normalizedUrl === "/courses/top") {
    return success({ courses: getTopCourses() });
  }

  if (method === "get" && normalizedUrl.startsWith("/courses/search")) {
    const query = new URLSearchParams(normalizedUrl.split("?")[1] || "").get("q") || "";
    return success(searchCourses(query));
  }

  if (method === "get" && normalizedUrl === "/app/get-users") {
    const { users } = getAdminReport();
    return success({ users });
  }

  if (method === "get" && normalizedUrl === "/courses/alldata") {
    const { userCourseRows } = getAdminReport();
    return success({ users: userCourseRows });
  }

  if (method === "post" && normalizedUrl === "/course/new-course") {
    const course = addNewCourse(await extractPayload(payload));
    return success(course, 201);
  }

  if (method === "get" && normalizedUrl === "/my-courses") {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    return success({ courses: getMyCourses(currentUser._id) });
  }

  if (method === "get" && normalizedUrl.startsWith("/my-courses/")) {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    const courseId = parseCourseId(normalizedUrl, "/my-courses/");
    if (isCourseEnrolled(currentUser._id, courseId)) {
      return success({ contentItem: getMyCourses(currentUser._id).find((item) => item.courseId === courseId)?.contentItem || [] }, 200);
    }

    return success({ message: "Not enrolled" }, 201);
  }

  if (method === "get" && normalizedUrl.startsWith("/course/") && !normalizedUrl.endsWith("/details")) {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    const courseId = parseCourseId(normalizedUrl, "/course/");
    return success(getCoursePreview(courseId, currentUser._id));
  }

  if (method === "get" && normalizedUrl.endsWith("/details")) {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    const courseId = normalizedUrl.split("/").filter(Boolean).slice(-2, -1)[0];
    return success(getCoursePreview(courseId, currentUser._id));
  }

  if (method === "post" && normalizedUrl === "/cart/addToCart") {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    const summary = addCourseToCart(currentUser._id, payload.courseId);
    return success(summary);
  }

  if (method === "get" && normalizedUrl === "/cart") {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    const summary = getCartSummary(currentUser._id);
    return success({ userCart: { items: summary.items }, totalPrice: summary.totalPrice });
  }

  if (method === "post" && normalizedUrl === "/cart/purchase") {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    return success(checkoutCart(currentUser._id));
  }

  if (method === "post" && normalizedUrl === "/cart/enrollmentKeys") {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    const keys = getLastCheckout()?.enrollmentKeys || [];
    return success({ enrollmentKeys: keys });
  }

  if (method === "put" && normalizedUrl === "/course/enrollmentStatus") {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    try {
      return success(enrollWithKey({ userId: currentUser._id, courseId: payload.courseId, key: payload.key }));
    } catch (error) {
      return failure(error.message || "Invalid enrollment key.", 400);
    }
  }

  if (method === "post" && normalizedUrl === "/my-courses/add-new") {
    if (!currentUser) {
      return failure("Please sign in first.", 401);
    }

    const courseId = payload.courseId;
    const course = findCourseById(courseId);
    if (!course) {
      return failure("Course not found.", 404);
    }

    enrollCourseDirect(currentUser._id, courseId, 25);
    return success({ message: "Course enrolled" });
  }

  return failure(`Unsupported mock endpoint: ${method.toUpperCase()} ${normalizedUrl}`, 404);
};

const mockAxios = {
  get: (url, config) => routeResponse("get", url, undefined, config),
  post: (url, payload, config) => routeResponse("post", url, payload, config),
  put: (url, payload, config) => routeResponse("put", url, payload, config),
  delete: (url, config) => routeResponse("delete", url, undefined, config),
};

export default mockAxios;
