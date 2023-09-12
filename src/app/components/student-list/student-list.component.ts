import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Student } from 'src/app/data';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit {
  public studentsForm: FormGroup;
  public isGroup: boolean = false;
  public groupNumber: string = '';

  private _studentsListObs$ = new BehaviorSubject<Student[]>([]);
  public get studentsList(): Student[] {
    return this._studentsListObs$.getValue();
  }
  public set studentsList(students: Student[]) {
    this._studentsListObs$.next(students);
  }
  public get studentsListObs(): Observable<Student[]> {
    return this._studentsListObs$.asObservable();
  }

  constructor(
    private backendService: BackendService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.studentsForm = this.fb.group({
      studentName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(take(1))
      .pipe(
        switchMap((params) => {
          const groupId = +params['groupId'];
          return this.backendService.getGroupById(groupId).pipe(
            catchError((error) => {
              console.error('Ошибка при загрузке группы:', error);
              return EMPTY;
            })
          );
        }),
        catchError((error) => {
          console.error('Произошла ошибка в ngOnInit():', error);
          return throwError(() => error);
        })
      )
      .subscribe((group) => {
        if (group) {
          this.isGroup = true;
          this.groupNumber = '№ ' + group.groupNumber;
          this.loadStudents(group.id);
        } else {
          this.groupNumber = 'не найдена';
        }
      });
  }

  public loadStudents(groupId: number): void {
    this.backendService
      .listStudents()
      .pipe(take(1))
      .pipe(
        catchError((error) => {
          console.error('Произошла ошибка в loadStudents():', error);
          return throwError(() => error);
        })
      )
      .subscribe((students) => {
        this.studentsList = students.filter(
          (student) => student.groupId === groupId
        );
        this.sortStudentsByName();
      });
  }

  public addNewStudent(newStudentName: string): void {
    if (this.studentsForm.valid) {
      const groupId: number = +this.route.snapshot.queryParams['groupId'];
      this.backendService
        .createStudent(newStudentName, groupId)
        .pipe(take(1))
        .pipe(
          catchError((error) => {
            console.error('Произошла ошибка в addNewStudent():', error);
            return throwError(() => error);
          })
        )
        .subscribe((resp) => {
          if (resp.success) {
            this.studentsList.push(resp.data);
            this.studentsForm.reset();
          }
        });
    }
  }

  public deleteStudent(id: number): void {
    this.backendService
      .deleteStudent(id)
      .pipe(take(1))
      .pipe(
        catchError((error) => {
          console.error('Произошла ошибка в deleteStudent():', error);
          return throwError(() => error);
        })
      )
      .subscribe((resp) => {
        if (resp.success) {
          this.studentsList = this.studentsList.filter(
            (student) => student.id !== id
          );
        }
      });
  }

  public sortStudentsByName() {
    this.studentsList.sort((a, b) => a.name.localeCompare(b.name));
  }

  public goToGroupsList() {
    this.router.navigate(['']);
  }
}
