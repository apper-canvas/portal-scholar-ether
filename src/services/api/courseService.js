import coursesData from "@/services/mockData/courses.json";

let courses = [...coursesData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const courseService = {
  async getAll() {
    await delay();
    return [...courses];
  },

  async getById(id) {
    await delay();
    const course = courses.find(c => c.Id === id);
    if (!course) throw new Error("Course not found");
    return { ...course };
  },

  async create(courseData) {
    await delay();
    const maxId = Math.max(...courses.map(c => c.Id), 0);
    const newCourse = {
      ...courseData,
      Id: maxId + 1
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay();
    const index = courses.findIndex(c => c.Id === id);
    if (index === -1) throw new Error("Course not found");
    
    courses[index] = { ...courses[index], ...courseData };
    return { ...courses[index] };
  },

  async delete(id) {
    await delay();
    const index = courses.findIndex(c => c.Id === id);
    if (index === -1) throw new Error("Course not found");
    
    const deleted = courses.splice(index, 1)[0];
    return { ...deleted };
  }
};