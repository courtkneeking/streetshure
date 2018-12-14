import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';


const routes: Routes = [
  {path: '', component: MapComponent},
  {path: 'home', component: HomeComponent},
  {path: 'home/edit', component: EditComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
