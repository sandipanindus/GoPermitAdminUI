import { Component, OnInit,ViewChild } from '@angular/core';
import { jQuery } from 'jquery';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AiaImageAnnotatorComponent } from 'angular-image-annotator';
//import { annotoriousService } from 'angular-annotorious';
@Component({
  selector: 'app-annotorium',
  templateUrl: './annotorium.component.html'
})
export class AnnotoriumComponent implements OnInit {
  myImage="assets/img/fruitcake.jpg"; // Instantiate with your image
  showCropper=false;
  
  @ViewChild('annotator') annotator: AiaImageAnnotatorComponent;
  constructor() { }

  ngOnInit() {

    //var photo = jQuery(document).find(".your-image")[0];
   // annotoriousService.makeAnnotatable(photo);
   // annotoriousService.setProperties({
    //  outline: '#00f',
   //   stroke: '#ff0000',
    //  fill: 'rgba(255, 0, 0, 0.3)',
    //  'hi_stroke': '#00ff00',
    //  'hi_fill': 'rgba(0, 255, 0, 0.3)'
   // });
  }
  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.showCropper=true;
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
}
