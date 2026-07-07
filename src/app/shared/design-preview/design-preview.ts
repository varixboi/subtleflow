import { Component, Input } from '@angular/core';
import { previewDesign } from '../../models/design/previewDesign';

@Component({
  selector: 'app-design-preview',
  imports: [],
  templateUrl: './design-preview.html',
  styleUrl: './design-preview.css',
})
export class DesignPreview {
  @Input() selectedDesign!: previewDesign;
}
