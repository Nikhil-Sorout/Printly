export interface Item {
    name: string;
    price: number;
  }
  
  export interface Category {
    id: number;
    name: string;
    items: Item[];
  }
  
  export const menuData: Category[] = [
    {
      id: 1,
      name: 'Appetizers',
      items: [
        { name: 'Spring Rolls', price: 5 },
        { name: 'Nachos', price: 6 },
        { name: 'Stuffed Mushrooms', price: 7 },
        { name: 'Garlic Bread', price: 4 },
      ],
    },
    {
      id: 2,
      name: 'Soups',
      items: [
        { name: 'Tomato Soup', price: 3 },
        { name: 'Chicken Soup', price: 4 },
        { name: 'Mushroom Soup', price: 4 },
        { name: 'Hot & Sour Soup', price: 5 },
      ],
    },
    {
      id: 3,
      name: 'Salads',
      items: [
        { name: 'Caesar Salad', price: 8 },
        { name: 'Greek Salad', price: 7 },
        { name: 'Garden Salad', price: 6 },
        { name: 'Fruit Salad', price: 5 },
      ],
    },
    {
      id: 4,
      name: 'Main Course',
      items: [
        { name: 'Grilled Chicken', price: 15 },
        { name: 'Pasta Alfredo', price: 12 },
        { name: 'Vegetable Stir Fry', price: 10 },
        { name: 'Beef Steak', price: 18 },
      ],
    },
    {
      id: 5,
      name: 'Beverages',
      items: [
        { name: 'Coca Cola', price: 2 },
        { name: 'Pepsi', price: 2 },
        { name: 'Lemonade', price: 3 },
        { name: 'Iced Tea', price: 3 },
      ],
    },
    {
      id: 6,
      name: 'Desserts',
      items: [
        { name: 'Brownie', price: 4 },
        { name: 'Ice Cream', price: 3 },
        { name: 'Cheesecake', price: 6 },
        { name: 'Apple Pie', price: 5 },
      ],
    },
    {
      id: 7,
      name: 'Snacks',
      items: [
        { name: 'Chips', price: 2 },
        { name: 'Popcorn', price: 3 },
        { name: 'Pretzels', price: 3 },
        { name: 'Cookies', price: 4 },
      ],
    },
    {
      id: 8,
      name: 'Sides',
      items: [
        { name: 'French Fries', price: 4 },
        { name: 'Mashed Potatoes', price: 5 },
        { name: 'Coleslaw', price: 3 },
        { name: 'Onion Rings', price: 4 },
      ],
    },
  ];
  