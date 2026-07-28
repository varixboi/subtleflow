import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Canvas, FabricImage } from 'fabric';

@Component({
  selector: 'app-mockup-generator',
  imports: [], // Add CommonModule etc. if needed
  templateUrl: './mockup-generator.html',
  styleUrl: './mockup-generator.css',
})
export class MockupGenerator implements AfterViewInit {

  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;
  
  private canvas!: Canvas;

  ngAfterViewInit(): void { 
    this.canvas = new Canvas('mockup-canvas');

    // 1. Set temporary initial size
    this.resizeCanvas();
    
    // 2. Load the blank t-shirt (This will recalculate size once loaded!)
    this.loadTshirtBackground();

    // 3. Prevent dragging objects outside the canvas
    this.canvas.on('object:moving', (e) => {
      const obj = e.target;
      if (!obj) return;

      obj.setCoords();
      const boundingRect = obj.getBoundingRect();
      
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();

      const offsetLeft = obj.left - boundingRect.left;
      const offsetTop = obj.top - boundingRect.top;

      const maxBoundingLeft = canvasWidth - boundingRect.width;
      const maxBoundingTop = canvasHeight - boundingRect.height;

      const clampedBoundingLeft = Math.max(0, Math.min(boundingRect.left, maxBoundingLeft));
      const clampedBoundingTop = Math.max(0, Math.min(boundingRect.top, maxBoundingTop));

      obj.set({
        left: clampedBoundingLeft + offsetLeft,
        top: clampedBoundingTop + offsetTop
      });
    });
  }
  
  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  // --- RESPONSIVE CANVAS ---
  private resizeCanvas() {
    if (!this.canvasContainer) return;

    const parentWidth = this.canvasContainer.nativeElement.clientWidth;
    const newWidth = parentWidth * 0.9;
    
    const bgImg = this.canvas.backgroundImage;
    let newHeight = newWidth / 1.5; // Temporary fallback

    // If background is loaded, mathematically shrink-wrap the canvas height to match
    if (bgImg) {
      const scale = newWidth / bgImg.width;
      newHeight = bgImg.height * scale;
    }
    
    this.canvas.setDimensions({ 
      width: newWidth, 
      height: newHeight 
    });
    
    this.scaleBackgroundToCanvas();
    this.canvas.renderAll();
  }

  // --- BACKGROUND LOAD & SCALE ---
  private loadTshirtBackground() {
    // IMPORTANT: Make sure this path is correct for your Angular setup
    FabricImage.fromURL('Mockups/MOCKUP BLACK 180REGFIT.png').then((img) => {
      this.canvas.backgroundImage = img;
      
      // Force resize immediately now that we know the image's exact dimensions
      this.resizeCanvas(); 
    });
  }

  private scaleBackgroundToCanvas() {
    const bgImg = this.canvas.backgroundImage;
    if (!bgImg) return;

    const canvasWidth = this.canvas.getWidth();
    const scale = canvasWidth / bgImg.width;

    bgImg.set({
      scaleX: scale,
      scaleY: scale,
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0
    });
  }

  // --- NEW FILE UPLOAD LOGIC ---
  public onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return; 

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result as string;

      FabricImage.fromURL(base64Image).then((img) => {
        // Scale it so it fits nicely on the shirt initially (1/3 of canvas width)
        const targetWidth = this.canvas.getWidth() / 3;
        img.scaleToWidth(targetWidth);

        this.canvas.add(img);
        this.canvas.centerObject(img);
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
      });
    };

    reader.readAsDataURL(file);
    
    // Clear the input in case they want to upload the exact same file again
    input.value = ''; 
  }

  // public downloadMockup() {
  //   // Optional: Add a multiplier if you want a higher-res download than what is shown on screen
  //   const imageSrc = this.canvas.toDataURL(); 
    
  //   const a = document.createElement('a');
  //   a.href = imageSrc;
  //   a.download = 'tshirt-mockup.png'; // Give the file a name
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // }

  public downloadMockup() {
    if (!this.canvas) return;

    // 1. Clear active selections so the bounding box doesn't appear in the download
    this.canvas.discardActiveObject();
    this.canvas.renderAll();

    // 2. Generate the image data from the canvas
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // Exports at 2x resolution for better quality
    });

    // 3. Create a temporary HTML link to trigger the download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'tshirt-mockup.png'; // The default file name
    
    // 4. Fake a click on the link to start the download, then clean it up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}