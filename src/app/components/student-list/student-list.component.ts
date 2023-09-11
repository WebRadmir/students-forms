import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription, catchError, switchMap, throwError } from 'rxjs';
import { Student } from 'src/app/data';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit, OnDestroy {
  studentsForm: FormGroup;
  students: Student[] = [];
  isGroup: boolean = false;
  groupNumber: string = '';
  private routeSubscription: Subscription | undefined;

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
    this.routeSubscription = this.route.queryParams
      .pipe(
        switchMap((params) => {
          const groupId = +params['groupId'];
          return this.backendService.getGroupById(groupId).pipe(
            catchError((error) => {
              console.error('Ошибка при загрузке группы:', error);
              return EMPTY;
            })
          );
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

  loadStudents(groupId: number): void {
    this.backendService.listStudents().subscribe((students) => {
      this.students = students.filter((student) => student.groupId === groupId);
      this.sortStudentsByName();
    });
  }

  addNewStudent(newStudentName: string): void {
    if (this.studentsForm.valid) {
      const groupId: number = +this.route.snapshot.queryParams['groupId'];
      this.backendService.createStudent(newStudentName, groupId);
      this.studentsForm.reset();
    }
  }

  deleteStudent(id: number): void {
    this.backendService.deleteStudent(id);
  }

  sortStudentsByName() {
    this.students.sort((a, b) => a.name.localeCompare(b.name));
  }

  goToGroupsList() {
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
