import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uploadlogo',
  templateUrl: './uploadlogo.component.html',
  styleUrls: ['./uploadlogo.component.scss']
})
export class UploadlogoComponent implements OnInit {

  logo: string;
  fileUrls: { [key: string]: string | null } = {};
  isDragging: { [key: string]: boolean } = {};
  
  onFileSelected(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0], field);
    }
  }
  
  onDragOver(event: DragEvent, field: string) {
    event.preventDefault();
    this.isDragging[field] = true;
  }
  
  onDragLeave(event: DragEvent, field: string) {
    event.preventDefault();
    this.isDragging[field] = false;
  }
  
  onDrop(event: DragEvent, field: string) {
    event.preventDefault();
    this.isDragging[field] = false;
  
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0], field);
    }
  }
  
  handleFile(file: File, field: string) {
    this.fileUrls[field] = URL.createObjectURL(file);
    console.log(`Selected file for ${field}:`, file);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
