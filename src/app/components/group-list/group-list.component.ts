import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { Group } from 'src/app/data';
import { BackendService } from 'src/app/services/backend.service';
import { groupNumberValidator } from 'src/app/my.validators';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit, OnDestroy {
  groupsForm: FormGroup;
  groups: Group[] = [];
  private loadGroupSubscription: Subscription | null = null;
  private createGroupSubscription: Subscription | null = null;

  constructor(
    private backendService: BackendService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.groupsForm = this.fb.group({
      groupNumber: ['', [Validators.required, groupNumberValidator()]],
    });
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.loadGroupSubscription = this.backendService
      .listGroups()
      .pipe(
        catchError((error) => {
          console.error('Произошла ошибка в loadGroups():', error);
          return throwError(() => error);
        })
      )
      .subscribe((groups) => {
        this.groups = groups;
        this.sortGroupsByCreatedAt();
      });
  }

  addNewGroup(): void {
    if (this.groupsForm.valid) {
      const newGroupNumber: string = this.groupsForm.get('groupNumber')?.value;
      this.createGroupSubscription = this.backendService
        .createGroup(newGroupNumber)
        .pipe(
          catchError((error) => {
            console.error('Произошла ошибка в addNewGroup():', error);
            return throwError(() => error);
          })
        )
        .subscribe((groups) => {
          const newGroupId: number = groups[groups.length - 1].id;
          this.editGroup(newGroupId);
        });

      this.groupsForm.reset();
    }
  }

  editGroup(groupId: number): void {
    this.router.navigate(['/students'], { queryParams: { groupId } });
  }

  sortGroupsByCreatedAt() {
    this.groups.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  ngOnDestroy(): void {
    if (this.loadGroupSubscription) {
      this.loadGroupSubscription.unsubscribe();
    }
    if (this.createGroupSubscription) {
      this.createGroupSubscription.unsubscribe();
    }
  }
}
