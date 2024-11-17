export const GenderOptions = ["Male", "Female"];

enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
}

type Subject = {
  id: number;
  name: string;
};

type Class = {
  id: number;
  name: string;
  grade: number;
};

type Teacher = {
  id: string;
  name: string;
};

type Exam = {
  id: number;
  date: string; // ISO date string format
  lessonId: number;
};

type Assignment = {
  id: number;
  title: string;
  dueDate: string; // ISO date string format
  lessonId: number;
};

type Attendance = {
  id: number;
  date: string; // ISO date string format
  status: string;
  lessonId: number;
};

export type Lesson = {
  id: number;
  name: string;
  day: string; // Use a string enum if needed (e.g., 'MONDAY' | 'TUESDAY' | ...)
  startTime: string | number | Date; // ISO date string | number | Date format
  endTime: string | number | Date; // ISO date string format
  subjectId: number;
  subject: Subject;
  classId: number;
  class: Class;
  teacherId: string;
  teacher: Teacher;
  exams: Exam[];
  assignments: Assignment[];
  attendance: Attendance[];
};
