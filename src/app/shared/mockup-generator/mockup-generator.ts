import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { StaticCanvas, FabricText, Canvas } from 'fabric'

@Component({
  selector: 'app-mockup-generator',
  imports: [],
  templateUrl: './mockup-generator.html',
  styleUrl: './mockup-generator.css',
})
export class MockupGenerator implements AfterViewInit{
  private canvas !: Canvas;

  ngAfterViewInit(): void { 
    this.canvas = new Canvas('mockup-canvas')
    const helloWorld = new FabricText('Hello world!');
    this.canvas.add(helloWorld);
    this.canvas.centerObject(helloWorld);
    
    this.canvas.renderAll();

    const imageSrc = this.canvas.toDataURL();
    // some download code down here
    const a = document.createElement('a');
    a.href = imageSrc;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }  
}


