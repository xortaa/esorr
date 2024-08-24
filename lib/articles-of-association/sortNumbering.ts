function parseSectionNumber(sectionNumber) {
  const parts = sectionNumber.split(/(\d+|\D+)/).filter(Boolean);
  return parts.map((part) => (isNaN(part) ? part : Number(part)));
}

function compareSections(a, b) {
  const aParts = parseSectionNumber(a.number);
  const bParts = parseSectionNumber(b.number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    if (aParts[i] === undefined) return -1;
    if (bParts[i] === undefined) return 1;
    if (typeof aParts[i] === "number" && typeof bParts[i] === "number") {
      if (aParts[i] !== bParts[i]) return aParts[i] - bParts[i];
    } else {
      if (aParts[i] !== bParts[i]) return aParts[i].localeCompare(bParts[i]);
    }
  }
  return 0;
}

const sections = [
  { number: "3.2.b", title: "Vice-President External" },
  { number: "3.1", title: "President" },
  { number: "3.2.a", title: "Vice-President Internal" },
  { number: "3.3", title: "Secretary" },
];

sections.sort(compareSections);

console.log(sections);
