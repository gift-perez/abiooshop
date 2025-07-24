export interface CartItem {
    name: string;
    price: number;
    description: string;
    quantity: number;
    image: string;
    subtotal: number;
    stock: number;
}

export interface Cart {
    status: string;
    subtotal: number;
    shipping_cost: number;
    total_cost: number;
    num_items: number;
}
