import { Injectable } from '@angular/core';
import { Group, Student } from '../data';
import { fakeGroups, fakeStudents } from '../data';
import { BehaviorSubject, Observable, map, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private students: Student[] = [];
  private studentsSubject = new BehaviorSubject<Student[]>(this.students);
  private groups: Group[] = [];
  private groupsSubject = new BehaviorSubject<Group[]>(this.groups);

  constructor(private route: ActivatedRoute) {
    timer(50)
      .pipe(
        map(() => {
          this.students = fakeStudents;
          this.studentsSubject.next(this.students);

          this.groups = fakeGroups;
          this.groupsSubject.next(this.groups);
        })
      )
      .subscribe();
  }

  listGroups(): Observable<Group[]> {
    return this.groupsSubject.asObservable().pipe(
      map((groups) => {
        return groups.map((group) => {
          const studentsInGroup = this.students.filter(
            (student) => student.groupId === group.id
          );
          return {
            ...group,
            numberOfStudents: studentsInGroup.length,
          };
        });
      })
    );
  }

  createGroup(newGroupNumber: string): Observable<Group[]> {
    return this.groupsSubject.asObservable().pipe(
      map((groups) => {
        const maxId = Math.max(...groups.map((group) => group.id), 0);
        const newGroup: Group = {
          id: maxId + 1,
          groupNumber: newGroupNumber,
          numberOfStudents: 0,
          createdAt: new Date(),
        };
        this.groups.push(newGroup);
        return groups;
      })
    );
  }

  listStudents(): Observable<Student[]> {
    return this.studentsSubject.asObservable();
  }

  createStudent(newStudentName: string, groupId: number): void {
    const maxId = Math.max(...this.students.map((student) => student.id), 0);

    const newStudent: Student = {
      id: maxId + 1,
      name: newStudentName,
      admissionDate: new Date(),
      groupId,
    };
    this.students.push(newStudent);
    this.studentsSubject.next(this.students);
    console.log(this.studentsSubject);
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
      })
    );
  }
}
