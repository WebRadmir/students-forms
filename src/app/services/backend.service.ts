import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  throwError,
  timer,
} from 'rxjs';
import { Group, Student } from '../data';
import { fakeGroups, fakeStudents } from '../data';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private students: Student[] = [];
  private studentsSubject = new BehaviorSubject<Student[]>(this.students);
  private groups: Group[] = [];
  private groupsSubject = new BehaviorSubject<Group[]>(this.groups);

  constructor() {
    timer(50)
      .pipe(
        map(() => {
          this.students = fakeStudents;
          this.studentsSubject.next(this.students);
          this.groups = fakeGroups;
          this.groupsSubject.next(this.groups);
        }),
        catchError((error) => {
          console.error('Произошла ошибка в constructor():', error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  listGroups(): Observable<Group[]> {
    return this.groupsSubject.asObservable().pipe(
      map((groups) => {
        return groups.map((group) => {
          const studentsInGroup: Student[] = this.students.filter(
            (student) => student.groupId === group.id
          );
          return {
            ...group,
            numberOfStudents: studentsInGroup.length,
          };
        });
      }),
      catchError((error) => {
        console.error('Произошла ошибка в listGroups():', error);
        return throwError(() => error);
      })
    );
  }

  createGroup(newGroupNumber: string): Observable<Group[]> {
    return this.groupsSubject.asObservable().pipe(
      map((groups) => {
        const maxId: number = Math.max(...groups.map((group) => group.id), 0);
        const newGroup: Group = {
          id: maxId + 1,
          groupNumber: newGroupNumber,
          numberOfStudents: 0,
          createdAt: new Date(),
        };
        this.groups.push(newGroup);
        return groups;
      }),
      catchError((error) => {
        console.error('Произошла ошибка в createGroup():', error);
        return throwError(() => error);
      })
    );
  }

  listStudents(): Observable<Student[]> {
    return this.studentsSubject.asObservable().pipe(
      catchError((error) => {
        console.error('Произошла ошибка в listStudents():', error);
        return throwError(() => error);
      })
    );
  }

  createStudent(newStudentName: string, groupId: number): void {
    const maxId: number = Math.max(
      ...this.students.map((student) => student.id),
      0
    );

    const newStudent: Student = {
      id: maxId + 1,
      name: newStudentName,
      admissionDate: new Date(),
      groupId,
    };
    this.students.push(newStudent);
    this.studentsSubject.next(this.students);
  }

  deleteStudent(studentIdtoDelete: number): void {
    this.students = this.students.filter(
      (student) => student.id !== studentIdtoDelete
    );
    this.studentsSubject.next(this.students);
  }

  getGroupById(groupId: number): Observable<Group | undefined> {
    return this.groupsSubject.asObservable().pipe(
      map((groups) => {
        return groups.find((group) => group.id === groupId);
      }),
      catchError((error) => {
        console.error('Произошла ошибка в getGroupById():', error);
        return throwError(() => error);
      })
    );
  }
}
