import { Student, Attendance, Result, TimetableEntry, User } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'sms_students',
  ATTENDANCE: 'sms_attendance',
  RESULTS: 'sms_results',
  TIMETABLE: 'sms_timetable',
  USERS: 'sms_users',
  CURRENT_USER: 'sms_current_user'
};

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Student functions
export function getStudents(): Student[] {
  return getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
}

export function saveStudent(student: Student): void {
  const students = getStudents();
  const existingIndex = students.findIndex(s => s.id === student.id);
  
  if (existingIndex >= 0) {
    students[existingIndex] = student;
  } else {
    students.push(student);
  }
  
  saveToStorage(STORAGE_KEYS.STUDENTS, students);
}

export function deleteStudent(id: string): void {
  const students = getStudents().filter(s => s.id !== id);
  saveToStorage(STORAGE_KEYS.STUDENTS, students);
}

// Attendance functions
export function getAttendance(): Attendance[] {
  return getFromStorage<Attendance>(STORAGE_KEYS.ATTENDANCE);
}

export function saveAttendance(attendance: Attendance[]): void {
  saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance);
}

export function getAttendanceByDate(date: string, className: string): Attendance[] {
  return getAttendance().filter(a => a.date === date && a.class === className);
}

// Results functions
export function getResults(): Result[] {
  return getFromStorage<Result>(STORAGE_KEYS.RESULTS);
}

export function saveResult(result: Result): void {
  const results = getResults();
  const existingIndex = results.findIndex(r => r.id === result.id);
  
  if (existingIndex >= 0) {
    results[existingIndex] = result;
  } else {
    results.push(result);
  }
  
  saveToStorage(STORAGE_KEYS.RESULTS, results);
}

// Timetable functions
export function getTimetable(): TimetableEntry[] {
  return getFromStorage<TimetableEntry>(STORAGE_KEYS.TIMETABLE);
}

export function saveTimetableEntry(entry: TimetableEntry): void {
  const timetable = getTimetable();
  const existingIndex = timetable.findIndex(t => t.id === entry.id);
  
  if (existingIndex >= 0) {
    timetable[existingIndex] = entry;
  } else {
    timetable.push(entry);
  }
  
  saveToStorage(STORAGE_KEYS.TIMETABLE, timetable);
}

export function deleteTimetableEntry(id: string): void {
  const timetable = getTimetable().filter(t => t.id !== id);
  saveToStorage(STORAGE_KEYS.TIMETABLE, timetable);
}

// User authentication functions
export function initializeAdmin(): void {
  const users = getFromStorage<User>(STORAGE_KEYS.USERS);
  if (users.length === 0) {
    const adminUser: User = {
      id: '1',
      username: 'admin',
      role: 'admin'
    };
    saveToStorage(STORAGE_KEYS.USERS, [adminUser]);
  }
}

export function authenticateUser(username: string, password: string): User | null {
  // Simple authentication - in production, use proper password hashing
  if (username === 'admin' && password === 'admin123') {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.username === username) || null;
  }
  return null;
}

export function getCurrentUser(): User | null {
  const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userData ? JSON.parse(userData) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function calculateGrade(percentage: number): string {
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'E';
}