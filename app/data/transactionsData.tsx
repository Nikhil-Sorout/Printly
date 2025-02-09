export interface transactionItem{
    id: number,
    date: string,
    total_amount: number,
    items: items[] 
}
export interface items{
    item_id: number,
    name: string,
    category_id: number,
    price: number,
    quantity: number,
    total_price: number
}

export const transactionsData = [
    {
      "id": 1,
      "date": "2024-01-05T14:15:00Z",
      "total_amount": 40,
      "items": [
        { "item_id": 101, "name": "Spring Rolls", "category_id": 1, "price": 5, "quantity": 2, "total_price": 10 },
        { "item_id": 202, "name": "Tomato Soup", "category_id": 2, "price": 3, "quantity": 1, "total_price": 3 },
        { "item_id": 403, "name": "Vegetable Stir Fry", "category_id": 4, "price": 10, "quantity": 2, "total_price": 20 },
        { "item_id": 502, "name": "Lemonade", "category_id": 5, "price": 3, "quantity": 1, "total_price": 3 }
      ],
      "payment_method": "cash",
      "customer_id": 567
    },
    {
      "id": 2,
      "date": "2024-01-10T18:45:00Z",
      "total_amount": 26,
      "items": [
        { "item_id": 101, "name": "Spring Rolls", "category_id": 1, "price": 5, "quantity": 1, "total_price": 5 },
        { "item_id": 302, "name": "Greek Salad", "category_id": 3, "price": 7, "quantity": 2, "total_price": 14 },
        { "item_id": 602, "name": "Ice Cream", "category_id": 6, "price": 3, "quantity": 2, "total_price": 6 }
      ],
      "payment_method": "credit_card",
      "customer_id": 789
    },
    {
      "id": 3,
      "date": "2024-02-02T12:10:00Z",
      "total_amount": 38,
      "items": [
        { "item_id": 404, "name": "Beef Steak", "category_id": 4, "price": 18, "quantity": 1, "total_price": 18 },
        { "item_id": 101, "name": "Spring Rolls", "category_id": 1, "price": 5, "quantity": 2, "total_price": 10 },
        { "item_id": 502, "name": "Lemonade", "category_id": 5, "price": 3, "quantity": 1, "total_price": 3 },
        { "item_id": 702, "name": "Cookies", "category_id": 7, "price": 4, "quantity": 1, "total_price": 4 }
      ],
      "payment_method": "UPI",
      "customer_id": 890
    },
    {
      "id": 4,
      "date": "2024-02-15T20:30:00Z",
      "total_amount": 50,
      "items": [
        { "item_id": 101, "name": "Spring Rolls", "category_id": 1, "price": 5, "quantity": 2, "total_price": 10 },
        { "item_id": 202, "name": "Tomato Soup", "category_id": 2, "price": 3, "quantity": 1, "total_price": 3 },
        { "item_id": 302, "name": "Greek Salad", "category_id": 3, "price": 7, "quantity": 1, "total_price": 7 },
        { "item_id": 404, "name": "Beef Steak", "category_id": 4, "price": 18, "quantity": 1, "total_price": 18 },
        { "item_id": 502, "name": "Lemonade", "category_id": 5, "price": 3, "quantity": 2, "total_price": 6 },
        { "item_id": 602, "name": "Ice Cream", "category_id": 6, "price": 3, "quantity": 2, "total_price": 6 }
      ],
      "payment_method": "cash",
      "customer_id": 123
    },
    {
      "id": 5,
      "date": "2024-03-07T15:00:00Z",
      "total_amount": 22,
      "items": [
        { "item_id": 702, "name": "Cookies", "category_id": 7, "price": 4, "quantity": 2, "total_price": 8 },
        { "item_id": 801, "name": "French Fries", "category_id": 8, "price": 4, "quantity": 3, "total_price": 12 },
        { "item_id": 502, "name": "Lemonade", "category_id": 5, "price": 3, "quantity": 1, "total_price": 3 }
      ],
      "payment_method": "credit_card",
      "customer_id": 456
    }
  ]
  