import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  take,
  throwError,
} from 'rxjs';
import { Group } from 'src/app/data';
import { BackendService } from 'src/app/services/backend.service';
import { groupNumberValidator } from 'src/app/my.validators';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {
  public groupsForm: FormGroup;

  constructor(
    private backendService: BackendService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.groupsForm = this.fb.group({
      groupNumber: ['', [Validators.required, groupNumberValidator()]],
    });
  }

  private _groupsListObs$ = new BehaviorSubject<Group[]>([]);
  public get groupList(): Group[] {
    return this._groupsListObs$.getValue();
  }
  public set groupList(groups: Group[]) {
    this._groupsListObs$.next(groups);
  }
  public get groupListObs(): Observable<Group[]> {
    return this._groupsListObs$.asObservable();
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  public loadGroups(): void {
    this.backendService
      .listGroups()
      .pipe(take(1))
      .pipe(
        catchError((error) => {
          console.error('Произошла ошибка в loadGroups():', error);
          return throwError(() => error);
        })
      )
      .subscribe((groups) => {
        this.groupList = groups;
        this.sortGroupsByCreatedAt();
      });
  }

  public addNewGroup(): void {
    if (this.groupsForm.valid) {
      const newGroupNumber: string = this.groupsForm.get('groupNumber')?.value;
      this.backendService
        .createGroup(newGroupNumber)
        .pipe(take(1))
        .pipe(
          catchError((error) => {
            console.error('Произошла ошибка в addNewGroup():', error);
            return throwError(() => error);
          })
        )
        .subscribe((resp) => {
          if (resp.success) {
            this.editGroup(resp.data.id);
            this.groupsForm.reset();
          }
        });
    }
  }

  public editGroup(groupId: number): void {
    this.router.navigate(['/students'], { queryParams: { groupId } });
  }

  public sortGroupsByCreatedAt() {
    this.groupList.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }
}
