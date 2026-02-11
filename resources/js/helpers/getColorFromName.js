const colors = [
  "#0B2D72",
  "#0992C2",
  "#0AC4E0",
  "#2845D6",
  "#0C2C55",
  "#4988C4",
  "#629FAD",
  "#1A3D64"
]

export function getColorFromName(name) {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return colors[hash % colors.length]
}