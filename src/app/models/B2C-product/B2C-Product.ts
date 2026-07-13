export interface B2CProduct {
  id: string;
  product_name:string;
  price: Record<number, number>;
  product_description: string;
  display_name: string;
  colors: string[];
  sizes:string[];
  images:string[];
}
