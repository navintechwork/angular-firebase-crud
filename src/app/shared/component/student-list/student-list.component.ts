import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Student } from '../../interface/student';
import { CrudService } from '../../service/crud.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  p: number = 1;
  Student: Student[];
  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  
  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService
    ){ }

  ngOnInit() {
    this.dataState();
    let s = this.crudApi.GetStudentsList(); 
    s.snapshotChanges().subscribe(data => {
      this.Student = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.Student.push(a as Student);
      })
    })
  }
  dataState() {     
    this.crudApi.GetStudentsList().valueChanges().subscribe(data => {
      this.preLoader = false;
      if(data.length <= 0){
        this.hideWhenNoStudent = false;
        this.noData = true;
      } else {
        this.hideWhenNoStudent = true;
        this.noData = false;
      }
    })
  }
  deleteStudent(student) {
    if (window.confirm('Are sure you want to delete this student ?')) { 
      this.crudApi.DeleteStudent(student.$key)
      this.toastr.success(student.firstName + ' successfully deleted!');
    }
  }
}
