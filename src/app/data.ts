export interface Student {
  id: number;
  name: string;
  admissionDate: Date;
  groupId: number;
}

export interface Group {
  id: number;
  groupNumber: string;
  numberOfStudents: number;
  createdAt: Date;
}

export const fakeGroups: Group[] = [
  {
    id: 1,
    groupNumber: '20-01',
    numberOfStudents: 0,
    createdAt: new Date('2023-01-20'),
  },
  {
    id: 2,
    groupNumber: '20-02',
    numberOfStudents: 0,
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 3,
    groupNumber: '19-03',
    numberOfStudents: 0,
    createdAt: new Date('2023-03-19'),
  },
  {
    id: 4,
    groupNumber: '19-01',
    numberOfStudents: 0,
    createdAt: new Date('2023-01-19'),
  },
];

export const fakeStudents: Student[] = [
  {
    id: 1,
    name: 'Иванов Иван',
    admissionDate: new Date('2022-09-01'),
    groupId: 1,
  },
  {
    id: 2,
    name: 'Петров Петр',
    admissionDate: new Date('2022-09-02'),
    groupId: 1,
  },
  {
    id: 3,
    name: 'Сидорова Мария',
    admissionDate: new Date('2022-09-01'),
    groupId: 2,
  },
  {
    id: 4,
    name: 'Кузнецова Анна',
    admissionDate: new Date('2022-09-03'),
    groupId: 2,
  },
  {
    id: 5,
    name: 'Федоров Алексей',
    admissionDate: new Date('2022-09-01'),
    groupId: 3,
  },
];
