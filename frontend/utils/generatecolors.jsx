
  export const tailwindColors = [
    "bg-red-400",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-400",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-400",
    "bg-teal-500",
    "bg-cyan-500",
  ];


  export function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * tailwindColors.length);
    return tailwindColors[randomIndex];
  }