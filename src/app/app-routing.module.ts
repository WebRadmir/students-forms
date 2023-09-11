import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { StudentsPageComponent } from './pages/students-page/students-page.component';

const routes: Routes = [
  { path: '', component: GroupsPageComponent },
  { path: 'students', component: StudentsPageComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
