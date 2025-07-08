import { getRandomColor } from "./generatecolors";

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

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 1000);
  const color =getRandomColor(adjective.slice(0,1))
  
  const name = `${adjective}${animal}${number}`;

  return { name, color };
}
