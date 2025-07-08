  export function getRandomUser() {
    const adjectives = [
      "Swift",
      "Brave",
      "Happy",
      "Clever",
      "Wild",
      "Lazy",
      "Fierce",
      "Silent",
      "Noisy",
      "Curious",
      "Gentle",
      "Jolly",
      "Witty",
      "Loyal",
      "Bright",
      "Chilly",
      "Crazy",
      "Sleepy",
      "Silly",
      "Zany",
    ];

    const animals = [
      "Tiger",
      "Lion",
      "Panda",
      "Dolphin",
      "Penguin",
      "Fox",
      "Koala",
      "Bear",
      "Eagle",
      "Owl",
      "Wolf",
      "Rabbit",
      "Giraffe",
      "Zebra",
      "Elephant",
      "Otter",
      "Hawk",
      "Deer",
      "Monkey",
      "Swan",
    ];

    const tailwindColors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-rose-500",
      "bg-teal-500",
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const number = Math.floor(Math.random() * 1000);
    const color =
      tailwindColors[Math.floor(Math.random() * tailwindColors.length)];

    const name = `${adjective}${animal}${number}`;

    return { name, color };
  }