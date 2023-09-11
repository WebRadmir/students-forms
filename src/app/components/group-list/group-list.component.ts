import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Group } from 'src/app/data';
import { BackendService } from 'src/app/services/backend.service';
import { groupNumberValidator } from 'src/app/my.validators';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {
  groupsForm: FormGroup;
  groups: Group[] = [];

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
    this.backendService.listGroups().subscribe((groups) => {
      this.groups = groups;
      this.sortGroupsByCreatedAt();
    });
  }

  addNewGroup(): void {
    if (this.groupsForm.valid) {
      const newGroupNumber = this.groupsForm.get('groupNumber')?.value;
      this.backendService.createGroup(newGroupNumber).subscribe((groups) => {
        const newGroupId = groups[groups.length - 1].id;
        this.editGroup(newGroupId);
      });
      this.groupsForm.reset();
    }
  }

  editGroup(groupId: number): void {
    this.router.navigate(['/students'], { queryParams: { groupId } });
  }

  sortGroupsByCreatedAt() {
    this.groups.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }
}
