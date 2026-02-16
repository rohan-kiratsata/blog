export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
}

export const inventoryItems: InventoryItem[] = [
  {
    id: "macbook",
    name: "MacBook Pro",
    description: "My daily driver for coding",
    image: "/inventory/macbook.svg",
    link: "https://apple.com/macbook-pro",
    position: { x: 400, y: 300 },
    size: { width: 280, height: 180 },
  },
  {
    id: "airpods",
    name: "AirPods Pro",
    description: "Can't code without music",
    image: "/inventory/airpods.svg",
    link: "https://apple.com/airpods-pro",
    position: { x: 800, y: 200 },
    size: { width: 120, height: 120 },
  },
  {
    id: "coffee",
    name: "Iced Americano",
    description: "Fuel for late night coding sessions",
    image: "/inventory/coffee.svg",
    link: "https://starbucks.com",
    position: { x: 150, y: 500 },
    size: { width: 100, height: 160 },
  },
  {
    id: "hoodie",
    name: "Favorite Hoodie",
    description: "The unofficial developer uniform",
    image: "/inventory/hoodie.svg",
    link: "https://example.com/hoodie",
    position: { x: 600, y: 600 },
    size: { width: 200, height: 240 },
  },
  {
    id: "keyboard",
    name: "Mechanical Keyboard",
    description: "Cherry MX Browns for that satisfying click",
    image: "/inventory/keyboard.svg",
    link: "https://example.com/keyboard",
    position: { x: 1000, y: 450 },
    size: { width: 240, height: 100 },
  },
  {
    id: "monitor",
    name: "Studio Display",
    description: "27 inches of pixel perfection",
    image: "/inventory/monitor.svg",
    link: "https://apple.com/studio-display",
    position: { x: 1200, y: 150 },
    size: { width: 300, height: 220 },
  },
  {
    id: "sneakers",
    name: "New Balance 990",
    description: "Comfort meets style",
    image: "/inventory/sneakers.svg",
    link: "https://newbalance.com",
    position: { x: 200, y: 800 },
    size: { width: 180, height: 120 },
  },
  {
    id: "book",
    name: "Thinking Fast and Slow",
    description: "Currently reading",
    image: "/inventory/book.svg",
    link: "https://amazon.com",
    position: { x: 900, y: 750 },
    size: { width: 100, height: 150 },
  },
];
