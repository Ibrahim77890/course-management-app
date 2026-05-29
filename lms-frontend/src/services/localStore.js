const STORAGE_KEYS = {
  users: "lms_users_v1",
  courses: "lms_courses_v1",
  cart: "lms_cart_v1",
  enrollments: "lms_enrollments_v1",
  accessKeys: "lms_access_keys_v1",
  session: "lms_session_v1",
  checkout: "lms_checkout_v1",
  progress: "lms_progress_v1",
};

const createId = (prefix) => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
};

const svgDataUri = (label, fill = "#20385C") => {
  const safeLabel = String(label || "Course");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs><rect width="1200" height="800" rx="48" fill="url(#g)"/><circle cx="960" cy="160" r="140" fill="${fill}" opacity="0.16"/><circle cx="240" cy="640" r="180" fill="${fill}" opacity="0.12"/><text x="80" y="190" font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="${fill}">${safeLabel}</text><text x="80" y="280" font-family="Arial, sans-serif" font-size="32" fill="#334155">Learners Platform</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const textFileDataUri = (title, lines) => {
  const content = [`${title}`, "", ...(lines || [])].join("\n");
  return `data:text/plain;charset=UTF-8,${encodeURIComponent(content)}`;
};

const fallbackRead = (key, fallback) => {
  if (typeof localStorage === "undefined") {
    return fallback;
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const fallbackWrite = (key, value) => {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
};

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

const defaultUsers = [
  {
    _id: "user_admin",
    username: "Admin",
    email: "admin@learners.local",
    password: "Admin123!",
    role: "Admin",
  },
  {
    _id: "user_learner",
    username: "Ibrahim",
    email: "ibrahim@learners.local",
    password: "Learner123!",
    role: "user",
  },
];

const defaultCourses = [
  {
    _id: "course_it_foundations",
    code: "IT-101",
    title: "Digital Foundations for Modern Work",
    description:
      "Build practical fluency with productivity tools, online collaboration, and core digital habits for study and work.",
    major: "Information Technology",
    instructor: "Mariam Khan",
    price: 0,
    availability: true,
    tags: ["latest", "free", "top"],
    contents: [
      "Getting started with digital workflows",
      "Working safely in the cloud",
      "Team collaboration and shared documents",
      "Search, research, and information literacy",
    ],
    image: { path: svgDataUri("Digital Foundations") },
    files: [
      {
        originalName: "Course Overview.txt",
        path: textFileDataUri("Digital Foundations", [
          "Module 1: Getting started with digital workflows",
          "Module 2: Working safely in the cloud",
          "Module 3: Team collaboration and shared documents",
        ]),
      },
    ],
    createdAt: "2026-05-01T09:00:00.000Z",
    enrolledCount: 12,
  },
  {
    _id: "course_communication",
    code: "HU-204",
    title: "Professional Communication Lab",
    description:
      "Practice speaking, writing, presenting, and feedback routines that help learners communicate clearly and confidently.",
    major: "Humanities",
    instructor: "Sana Riaz",
    price: 29,
    availability: true,
    tags: ["latest", "top"],
    contents: [
      "Writing concise professional messages",
      "Presenting ideas with confidence",
      "Feedback, tone, and active listening",
      "Interview and portfolio communication",
    ],
    image: { path: svgDataUri("Communication Lab", "#f97316") },
    files: [
      {
        originalName: "Presentation Guide.txt",
        path: textFileDataUri("Professional Communication Lab", [
          "Presentation guide and speaking checklist",
          "Tone and feedback practice prompts",
        ]),
      },
    ],
    createdAt: "2026-05-08T09:00:00.000Z",
    enrolledCount: 25,
  },
  {
    _id: "course_language_skills",
    code: "LG-112",
    title: "Language Skills for Academic Success",
    description:
      "Strengthen reading, listening, and structured writing for assessments and everyday academic work.",
    major: "Languages",
    instructor: "Amina Yusuf",
    price: 0,
    availability: true,
    tags: ["latest", "free"],
    contents: [
      "Reading strategies for long-form texts",
      "Listening for detail and inference",
      "Paragraph structure and clarity",
      "Revision and self-editing methods",
    ],
    image: { path: svgDataUri("Language Skills", "#0f766e") },
    files: [
      {
        originalName: "Reading Pack.txt",
        path: textFileDataUri("Language Skills for Academic Success", [
          "Reading strategies",
          "Listening prompts",
          "Writing checklist",
        ]),
      },
    ],
    createdAt: "2026-05-11T09:00:00.000Z",
    enrolledCount: 15,
  },
  {
    _id: "course_ai_productivity",
    code: "IT-310",
    title: "AI Productivity Systems",
    description:
      "Learn how to use AI tools for planning, drafting, research support, and workflow automation responsibly.",
    major: "Information Technology",
    instructor: "Faizan Ahmed",
    price: 79,
    availability: true,
    tags: ["latest", "top"],
    contents: [
      "AI-assisted planning and task breakdown",
      "Prompting for study and work support",
      "Workflow automations and templates",
      "Risks, review, and responsible use",
    ],
    image: { path: svgDataUri("AI Productivity", "#7c3aed") },
    files: [
      {
        originalName: "Prompt Toolkit.txt",
        path: textFileDataUri("AI Productivity Systems", [
          "Prompt templates",
          "Review checklist",
          "Automation ideas",
        ]),
      },
    ],
    createdAt: "2026-05-19T09:00:00.000Z",
    enrolledCount: 34,
  },
];

const defaultEnrollments = {
  user_learner: ["course_it_foundations"],
};

const defaultCart = {
  user_learner: [
    {
      courseId: "course_ai_productivity",
      quantity: 1,
    },
  ],
};

const defaultAccessKeys = {
  user_learner: {
    course_it_foundations: "IT-101-IBRAHIM-FOUNDATIONS",
  },
};

const defaultProgress = {
  user_learner: {
    course_it_foundations: 45,
  },
};

const ensureSeeded = () => {
  if (!fallbackRead(STORAGE_KEYS.users, null)) {
    fallbackWrite(STORAGE_KEYS.users, defaultUsers);
  }

  if (!fallbackRead(STORAGE_KEYS.courses, null)) {
    fallbackWrite(STORAGE_KEYS.courses, defaultCourses);
  }

  if (!fallbackRead(STORAGE_KEYS.enrollments, null)) {
    fallbackWrite(STORAGE_KEYS.enrollments, defaultEnrollments);
  }

  if (!fallbackRead(STORAGE_KEYS.cart, null)) {
    fallbackWrite(STORAGE_KEYS.cart, defaultCart);
  }

  if (!fallbackRead(STORAGE_KEYS.accessKeys, null)) {
    fallbackWrite(STORAGE_KEYS.accessKeys, defaultAccessKeys);
  }

  if (!fallbackRead(STORAGE_KEYS.progress, null)) {
    fallbackWrite(STORAGE_KEYS.progress, defaultProgress);
  }
};

export const getSessionUser = () => {
  ensureSeeded();
  const session = fallbackRead(STORAGE_KEYS.session, null);
  return session || null;
};

export const setSessionUser = (session) => {
  fallbackWrite(STORAGE_KEYS.session, session);
};

export const clearSessionUser = () => {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.session);
};

export const listUsers = () => {
  ensureSeeded();
  return fallbackRead(STORAGE_KEYS.users, []).map(sanitizeUser);
};

export const listCourses = () => {
  ensureSeeded();
  return fallbackRead(STORAGE_KEYS.courses, []).slice();
};

export const findCourseById = (courseId) =>
  listCourses().find((course) => course._id === courseId) || null;

export const searchCourses = (query) => {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  return listCourses().filter((course) => {
    const haystack = [
      course.code,
      course.title,
      course.description,
      course.major,
      course.instructor,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
};

export const getLatestCourses = () =>
  listCourses()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 3);

export const getFreeCourses = () =>
  listCourses().filter((course) => Number(course.price) === 0);

export const getTopCourses = () =>
  listCourses().sort((left, right) => (right.enrolledCount || 0) - (left.enrolledCount || 0));

export const authenticateUser = ({ email, password }) => {
  const users = fallbackRead(STORAGE_KEYS.users, []);
  const user = users.find(
    (entry) => entry.email.toLowerCase() === String(email || "").toLowerCase() && entry.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const session = {
    ...sanitizeUser(user),
    authToken: `mock-${user._id}`,
  };

  setSessionUser(session);
  return session;
};

export const registerUser = ({ email, username, password, role }) => {
  const users = fallbackRead(STORAGE_KEYS.users, []);
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail || !username || !password) {
    throw new Error("Please provide email, username, and password.");
  }

  if (users.some((entry) => entry.email.toLowerCase() === normalizedEmail)) {
    throw new Error("A user with this email already exists.");
  }

  const newUser = {
    _id: createId("user"),
    email: normalizedEmail,
    username,
    password,
    role: String(role || "user").toLowerCase() === "admin" ? "Admin" : "user",
  };

  const nextUsers = [...users, newUser];
  fallbackWrite(STORAGE_KEYS.users, nextUsers);

  const session = {
    ...sanitizeUser(newUser),
    authToken: `mock-${newUser._id}`,
  };

  setSessionUser(session);
  return session;
};

export const getCartSummary = (userId) => {
  ensureSeeded();
  const courses = listCourses();
  const carts = fallbackRead(STORAGE_KEYS.cart, {});
  const items = (carts[userId] || []).map((item) => {
    const course = courses.find((entry) => entry._id === item.courseId);
    return {
      ...item,
      courseId: course,
    };
  });

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.courseId?.price || 0) * Number(item.quantity || 1),
    0
  );

  return { items, totalPrice };
};

export const addCourseToCart = (userId, courseId) => {
  const course = findCourseById(courseId);
  if (!course) {
    throw new Error("Course not found.");
  }

  const carts = fallbackRead(STORAGE_KEYS.cart, {});
  const currentItems = carts[userId] || [];
  const existingIndex = currentItems.findIndex((item) => item.courseId === courseId);

  if (existingIndex >= 0) {
    currentItems[existingIndex] = {
      ...currentItems[existingIndex],
      quantity: Number(currentItems[existingIndex].quantity || 1) + 1,
    };
  } else {
    currentItems.push({ courseId, quantity: 1 });
  }

  carts[userId] = currentItems;
  fallbackWrite(STORAGE_KEYS.cart, carts);
  return getCartSummary(userId);
};

const getEnrollments = () => fallbackRead(STORAGE_KEYS.enrollments, {});
const getAccessKeys = () => fallbackRead(STORAGE_KEYS.accessKeys, {});
const getProgress = () => fallbackRead(STORAGE_KEYS.progress, {});

const setEnrollments = (value) => fallbackWrite(STORAGE_KEYS.enrollments, value);
const setAccessKeys = (value) => fallbackWrite(STORAGE_KEYS.accessKeys, value);
const setProgress = (value) => fallbackWrite(STORAGE_KEYS.progress, value);
const setCart = (value) => fallbackWrite(STORAGE_KEYS.cart, value);
const setCheckout = (value) => fallbackWrite(STORAGE_KEYS.checkout, value);

export const enrollCourseDirect = (userId, courseId, progressValue = 10) => {
  const enrollments = getEnrollments();
  enrollments[userId] = enrollments[userId] || [];

  if (!enrollments[userId].includes(courseId)) {
    enrollments[userId].push(courseId);
  }

  setEnrollments(enrollments);

  const progress = getProgress();
  progress[userId] = progress[userId] || {};
  progress[userId][courseId] = progressValue;
  setProgress(progress);
};

export const isCourseEnrolled = (userId, courseId) => {
  const enrollments = getEnrollments();
  return (enrollments[userId] || []).includes(courseId);
};

export const getCoursePreview = (courseId, userId) => {
  const course = findCourseById(courseId);
  if (!course) {
    throw new Error("Course not found.");
  }

  if (isCourseEnrolled(userId, courseId)) {
    return {
      ...course,
      accessGranted: true,
      files: course.files,
    };
  }

  return {
    ...course,
    accessGranted: false,
    files: [],
  };
};

export const getMyCourses = (userId) => {
  const enrollments = getEnrollments();
  const progress = getProgress();
  const userEnrollments = enrollments[userId] || [];

  return userEnrollments.map((courseId) => {
    const course = findCourseById(courseId);
    return {
      courseId: course?._id,
      title: course?.title,
      major: course?.major,
      instructor: course?.instructor,
      progress: progress[userId]?.[courseId] ?? 0,
      contentItem: course?.contents || [],
    };
  });
};

export const enrollWithKey = ({ userId, courseId, key }) => {
  const accessKeys = getAccessKeys();
  const storedKey = accessKeys[userId]?.[courseId];

  if (!storedKey || storedKey !== key) {
    throw new Error("Invalid enrollment key.");
  }

  const enrollments = getEnrollments();
  const current = enrollments[userId] || [];
  if (!current.includes(courseId)) {
    current.push(courseId);
  }

  enrollments[userId] = current;
  setEnrollments(enrollments);

  const progress = getProgress();
  progress[userId] = progress[userId] || {};
  progress[userId][courseId] = 10;
  setProgress(progress);

  return getCoursePreview(courseId, userId);
};

const buildEnrollmentKey = (course, user) => {
  const code = String(course.code || "COURSE").replace(/[^A-Z0-9]/gi, "").toUpperCase();
  const name = String(user.username || user.email || "USER").replace(/[^A-Z0-9]/gi, "").toUpperCase();
  return `${code}-${name}-${String(course._id).slice(-4).toUpperCase()}`;
};

export const checkoutCart = (userId) => {
  const users = fallbackRead(STORAGE_KEYS.users, []);
  const courses = listCourses();
  const cartSummary = getCartSummary(userId);
  const enrollments = getEnrollments();
  const accessKeys = getAccessKeys();
  const progress = getProgress();
  const currentUser = users.find((entry) => entry._id === userId);

  const enrollmentKeys = cartSummary.items.map((item) => {
    const course = courses.find((entry) => entry._id === item.courseId._id);
    const key = buildEnrollmentKey(course, currentUser || {});

    accessKeys[userId] = accessKeys[userId] || {};
    accessKeys[userId][course._id] = key;

    enrollments[userId] = enrollments[userId] || [];
    if (!enrollments[userId].includes(course._id)) {
      enrollments[userId].push(course._id);
    }

    progress[userId] = progress[userId] || {};
    progress[userId][course._id] = 100;

    course.enrolledCount = Number(course.enrolledCount || 0) + item.quantity;

    return key;
  });

  fallbackWrite(STORAGE_KEYS.courses, courses);
  setEnrollments(enrollments);
  setAccessKeys(accessKeys);
  setProgress(progress);
  setCart({ ...(fallbackRead(STORAGE_KEYS.cart, {})), [userId]: [] });
  setCheckout({ userId, enrollmentKeys, purchasedAt: new Date().toISOString() });

  return {
    session: { url: "/cart/success" },
    enrollmentKeys,
  };
};

export const getLastCheckout = () => fallbackRead(STORAGE_KEYS.checkout, null);

export const getAdminReport = () => {
  const users = fallbackRead(STORAGE_KEYS.users, []).map(sanitizeUser);
  const enrollments = getEnrollments();
  const courses = listCourses();

  const userCourseRows = users.map((user) => ({
    userId: user._id,
    username: user.username,
    email: user.email,
    courses: (enrollments[user._id] || []).map((courseId) => {
      const course = courses.find((entry) => entry._id === courseId);
      return course ? course.title : courseId;
    }),
  }));

  return { users, userCourseRows };
};

export const addNewCourse = (payload) => {
  const courses = listCourses();
  const contents = Array.isArray(payload.contents) && payload.contents.length > 0
    ? payload.contents
    : Array.isArray(payload.contentArray) && payload.contentArray.length > 0
      ? payload.contentArray
      : ["Course introduction", "Learning outcomes", "Practice project"];

  const imagePath = payload.imagePath || payload.image || svgDataUri(payload.title || "New Course", "#0f172a");
  const fileNames = Array.isArray(payload.contentFiles) && payload.contentFiles.length > 0
    ? payload.contentFiles.map((entry, index) => ({
        originalName: entry.originalName || entry.name || `Resource-${index + 1}.txt`,
        path: entry.path || textFileDataUri(entry.originalName || entry.name || `Resource-${index + 1}`, contents),
      }))
    : [
        {
          originalName: `${payload.title || "Course"} Notes.txt`,
          path: textFileDataUri(payload.title || "Course", contents),
        },
      ];

  const newCourse = {
    _id: createId("course"),
    code: payload.code,
    title: payload.title,
    description: payload.description,
    major: payload.major,
    instructor: payload.instructor,
    price: Number(payload.price || 0),
    availability: Boolean(payload.availability),
    tags: ["latest"],
    contents,
    image: { path: imagePath },
    files: fileNames,
    createdAt: new Date().toISOString(),
    enrolledCount: 0,
  };

  courses.unshift(newCourse);
  fallbackWrite(STORAGE_KEYS.courses, courses);
  return newCourse;
};

export const updateExistingCourse = (courseId, payload) => {
  const courses = listCourses();
  const index = courses.findIndex((entry) => entry._id === courseId);

  if (index === -1) {
    throw new Error("Course not found.");
  }

  courses[index] = {
    ...courses[index],
    ...payload,
  };

  fallbackWrite(STORAGE_KEYS.courses, courses);
  return courses[index];
};

export const deleteCourse = (courseId) => {
  const courses = listCourses().filter((entry) => entry._id !== courseId);
  fallbackWrite(STORAGE_KEYS.courses, courses);
};
