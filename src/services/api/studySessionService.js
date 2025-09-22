import studySessionsData from "@/services/mockData/studySessions.json";

let studySessions = [...studySessionsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const studySessionService = {
  async getAll() {
    await delay();
    return [...studySessions];
  },

  async getById(id) {
    await delay();
    const session = studySessions.find(s => s.Id === id);
    if (!session) throw new Error("Study session not found");
    return { ...session };
  },

  async create(sessionData) {
    await delay();
    const maxId = Math.max(...studySessions.map(s => s.Id), 0);
    const newSession = {
      ...sessionData,
      Id: maxId + 1
    };
    studySessions.push(newSession);
    return { ...newSession };
  },

  async update(id, sessionData) {
    await delay();
    const index = studySessions.findIndex(s => s.Id === id);
    if (index === -1) throw new Error("Study session not found");
    
    studySessions[index] = { ...studySessions[index], ...sessionData };
    return { ...studySessions[index] };
  },

  async delete(id) {
    await delay();
    const index = studySessions.findIndex(s => s.Id === id);
    if (index === -1) throw new Error("Study session not found");
    
    const deleted = studySessions.splice(index, 1)[0];
    return { ...deleted };
  }
};