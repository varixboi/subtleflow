export interface Product {
  id: string;
  product_name:string;
  price: number;
  product_description: string;
  display_name: string;
  colors: string[];
  sample_price:number;
  sizes:string[];
  images:string[];
  weight: number;

  b2c_status: boolean;
  b2c_price: Record <number,number>;
}
