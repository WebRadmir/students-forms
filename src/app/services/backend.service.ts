import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError, timer } from 'rxjs';
import { Group, Student } from '../data';
import { fakeGroups, fakeStudents } from '../data';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private students: Student[] = fakeStudents;
  private groups: Group[] = fakeGroups;

  constructor() {}

  public handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(() => error);
  }

  public listGroups(): Observable<Group[]> {
    // Имитируем задержку ответа сервера в 50 мс
    return (
      timer(50)
        .pipe(
          map(() => {
            return this.groups.map((group) => {
              const studentsInGroup = this.students.filter(
                (student) => student.groupId === group.id
              );
              return {
                ...group,
                numberOfStudents: studentsInGroup.length,
              };
            });
          })
        )
        // Имитируем обработку ошибок, если бы вместо timer был сетевой запрос
        .pipe(catchError(this.handleError.bind(this)))
    );
  }

  public createGroup(
    newGroupNumber: string
  ): Observable<{ success: boolean; data: Group }> {
    return timer(50)
      .pipe(
        map(() => {
          const maxId: number = Math.max(
            ...this.groups.map((group) => group.id),
            0
          );
          const newGroup: Group = {
            id: maxId + 1,
            groupNumber: newGroupNumber,
            numberOfStudents: 0,
            createdAt: new Date(),
          };
          this.groups.push(newGroup);
          return {
            success: true,
            data: newGroup,
          };
        })
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  public listStudents(): Observable<Student[]> {
    return timer(50)
      .pipe(
        map(() => {
          return this.students;
        })
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  public createStudent(
    newStudentName: string,
    groupId: number
  ): Observable<{ success: boolean; data: Student }> {
    return timer(50)
      .pipe(
        map(() => {
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
          return {
            success: true,
            data: newStudent,
          };
        })
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  public deleteStudent(
    studentIdtoDelete: number
  ): Observable<{ success: boolean }> {
    return timer(50)
      .pipe(
        map(() => {
          this.students = this.students.filter(
            (student) => student.id !== studentIdtoDelete
          );
          return {
            success: true,
          };
        })
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  public getGroupById(groupId: number): Observable<Group | undefined> {
    return timer(50)
      .pipe(
        map(() => {
          return this.groups.find((group) => group.id === groupId);
        })
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
}
