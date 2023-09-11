import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from 'src/app/data';
import { BackendService } from 'src/app/services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit {
  studentsForm: FormGroup;
  students: Student[] = [];
  isGroup: boolean = false;
  groupNumber: string = '';
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
    this.route.queryParams.subscribe((params) => {
      const groupId = +params['groupId'];
      this.loadStudents(groupId);
      this.backendService.getGroupById(groupId).subscribe((group) => {
        if (group) {
          this.isGroup = true;

          this.groupNumber = '№ ' + group.groupNumber;
        } else {
          this.groupNumber = 'не найдена';
        }
      });
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
    this.students.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  goToGroupsList() {
    this.router.navigate(['']);
  }
}
