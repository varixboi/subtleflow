export interface RetailProduct {
    // 1. Core Identifiers
    id: string;                 
    name: string;               
    description?: string;        
    categories: string[];       
    
    // 2. Media
    thumbnail: string;          
    images: string[];           
    size_chart_id?: string;     // <-- Fixes the size_chart_id errors
    
    // 3. Wholesale Packaging & Pricing
    is_master_set: boolean;     
    colors: string[];           
    set_qty: number;            
    set_info: string;           
    set_price: number;          
    suggested_mrp: number;      // <-- Fixes the suggested_mrp errors
    
    // 4. Product Specifications
    gsm: string;                // <-- Fixes the gsm errors (Set to string as requested!)
    fabric_composition: '100% Cotton' | 'Cotton Blend' | 'Polyester' | 'Custom Blend'; //
    fabric_details: string; // <-- Fixes the fabric_composition errors
    fit_type: string;           // <-- Fixes the fit_type errors
    wash_care?: string;         
    branding?: 'Tear-away Label' | 'No Branding' | 'Non-tearable Branding';        
    
    // 5. Logistics, Tax & Inventory
    weight_per_set?: string;    
    lead_time?: string;         
    hsn_code?: string;          
    status: 'ready' | 'on_order' | 'out_of_stock' | 'hide';
}