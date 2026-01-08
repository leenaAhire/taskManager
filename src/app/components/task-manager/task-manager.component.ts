import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../model/task.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent {
  tasks: Task[] = [];
  filter: string = 'all';
  taskForm!: FormGroup
  cahngeStatus = false;

  constructor(private taskService: TaskService, 
              private fb: FormBuilder,
  ) { }
  ngOnInit() {
    this.loadTasks();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      status: "Pending"
    })

  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data
    });
  }

  addTask() {
    if (this.taskForm.invalid){
      return;
    }
    this.taskService.addTask(this.taskForm.value).subscribe((res) => {
      this.loadTasks();
    });
  }

  changeStatus(task: Task, event: any) {
    const checked = event.target.checked;
    task.status = checked ? 'Completed' : 'Pending';

    this.taskService.updateTask(task).subscribe((res) => {
      this.loadTasks();
    });
  }

  deleteTask(id?: number) {
    if (!id){
      return;
    } 
    this.taskService.deleteTask(id).subscribe((res) =>{
      this.loadTasks()

    });
  }

  filteredTasks() {
    if (this.filter === 'Completed') {
      return this.tasks.filter(t => t.status == "Completed");
    }
    if (this.filter === 'Pending') {
      return this.tasks.filter(t => t.status == "Pending");
    }
    return this.tasks;
  }
}
