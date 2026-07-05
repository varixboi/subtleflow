import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product/Product';

@Component({
  selector: 'app-color-selector',
  imports: [],
  templateUrl: './color-selector.html',
  styleUrl: './color-selector.css',
})
export class ColorSelector {

  @Input() colors!: string[];

  @Input() selectedColor!: string;

  @Output() colorChanged = new EventEmitter<string>();

}
