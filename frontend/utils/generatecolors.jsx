export const colors = [
  { a: { color: "bg-red-400" } },
  { b: { color: "bg-blue-400" } },
  { c: { color: "bg-green-400" } },
  { d: { color: "bg-yellow-400" } },
  { e: { color: "bg-purple-400" } },
  { f: { color: "bg-teal-400" } },
  { g: { color: "bg-orange-400" } },
  { h: { color: "bg-pink-400" } },
  { i: { color: "bg-indigo-400" } },
  { j: { color: "bg-cyan-400" } },
  { k: { color: "bg-red-400" } },
  { l: { color: "bg-blue-400" } },
  { m: { color: "bg-green-400" } },
  { n: { color: "bg-yellow-400" } },
  { o: { color: "bg-purple-400" } },
  { p: { color: "bg-teal-400" } },
  { q: { color: "bg-orange-400" } },
  { r: { color: "bg-pink-400" } },
  { s: { color: "bg-indigo-400" } },
  { t: { color: "bg-cyan-400" } },
  { u: { color: "bg-red-400" } },
  { v: { color: "bg-blue-400" } },
  { w: { color: "bg-green-400" } },
  { x: { color: "bg-yellow-400" } },
  { y: { color: "bg-purple-400" } },
  { z: { color: "bg-teal-400" } },
];

export function getRandomColor(letter) {
    console.log(letter)
  const found = colors.find(
    (obj) => Object.keys(obj)[0] === letter.toLowerCase() | "a"
  );
  return found ? Object.values(found)[0].color : "bg-gray-400";
}
