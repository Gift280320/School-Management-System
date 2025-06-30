export interface Student {
  id: string;
  admissionNumber: string;
  name: string;
  class: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent';
  class: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Result {
  id: string;
  studentId: string;
  subjectId: string;
  marks: number;
  totalMarks: number;
  term: string;
  year: string;
}

export interface TimetableEntry {
  id: string;
  class: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'teacher';
}

export const CLASSES = [
  'Pre-Primary 1', 'Pre-Primary 2',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9'
];

export const SUBJECTS = [
  { id: '1', name: 'Mathematics', code: 'MATH' },
  { id: '2', name: 'English', code: 'ENG' },
  { id: '3', name: 'Kiswahili', code: 'KIS' },
  { id: '4', name: 'Science', code: 'SCI' },
  { id: '5', name: 'Social Studies', code: 'SST' },
  { id: '6', name: 'Religious Education', code: 'RE' },
  { id: '7', name: 'Physical Education', code: 'PE' },
  { id: '8', name: 'Creative Arts', code: 'CA' }
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];