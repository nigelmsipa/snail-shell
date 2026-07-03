import { Verse, Pericope, Chapter, RecallQuestion } from '../types/bible';

// Genesis 1 verses (KJV)
export const genesis1Verses: Verse[] = [
  { id: "gen.1.1", book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth.", translation: "KJV" },
  { id: "gen.1.2", book: "Genesis", chapter: 1, verse: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.", translation: "KJV" },
  { id: "gen.1.3", book: "Genesis", chapter: 1, verse: 3, text: "And God said, Let there be light: and there was light.", translation: "KJV" },
  { id: "gen.1.4", book: "Genesis", chapter: 1, verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness.", translation: "KJV" },
  { id: "gen.1.5", book: "Genesis", chapter: 1, verse: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.", translation: "KJV" },
  { id: "gen.1.6", book: "Genesis", chapter: 1, verse: 6, text: "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.", translation: "KJV" },
  { id: "gen.1.7", book: "Genesis", chapter: 1, verse: 7, text: "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.", translation: "KJV" },
  { id: "gen.1.8", book: "Genesis", chapter: 1, verse: 8, text: "And God called the firmament Heaven. And the evening and the morning were the second day.", translation: "KJV" },
  { id: "gen.1.9", book: "Genesis", chapter: 1, verse: 9, text: "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.", translation: "KJV" },
  { id: "gen.1.10", book: "Genesis", chapter: 1, verse: 10, text: "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.", translation: "KJV" },
  { id: "gen.1.11", book: "Genesis", chapter: 1, verse: 11, text: "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.", translation: "KJV" },
  { id: "gen.1.12", book: "Genesis", chapter: 1, verse: 12, text: "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.", translation: "KJV" },
  { id: "gen.1.13", book: "Genesis", chapter: 1, verse: 13, text: "And the evening and the morning were the third day.", translation: "KJV" },
  { id: "gen.1.14", book: "Genesis", chapter: 1, verse: 14, text: "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:", translation: "KJV" },
  { id: "gen.1.15", book: "Genesis", chapter: 1, verse: 15, text: "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.", translation: "KJV" },
  { id: "gen.1.16", book: "Genesis", chapter: 1, verse: 16, text: "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.", translation: "KJV" },
  { id: "gen.1.17", book: "Genesis", chapter: 1, verse: 17, text: "And God set them in the firmament of the heaven to give light upon the earth,", translation: "KJV" },
  { id: "gen.1.18", book: "Genesis", chapter: 1, verse: 18, text: "And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.", translation: "KJV" },
  { id: "gen.1.19", book: "Genesis", chapter: 1, verse: 19, text: "And the evening and the morning were the fourth day.", translation: "KJV" },
  { id: "gen.1.20", book: "Genesis", chapter: 1, verse: 20, text: "And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.", translation: "KJV" },
  { id: "gen.1.21", book: "Genesis", chapter: 1, verse: 21, text: "And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.", translation: "KJV" },
  { id: "gen.1.22", book: "Genesis", chapter: 1, verse: 22, text: "And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.", translation: "KJV" },
  { id: "gen.1.23", book: "Genesis", chapter: 1, verse: 23, text: "And the evening and the morning were the fifth day.", translation: "KJV" },
  { id: "gen.1.24", book: "Genesis", chapter: 1, verse: 24, text: "And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.", translation: "KJV" },
  { id: "gen.1.25", book: "Genesis", chapter: 1, verse: 25, text: "And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.", translation: "KJV" },
  { id: "gen.1.26", book: "Genesis", chapter: 1, verse: 26, text: "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.", translation: "KJV" },
  { id: "gen.1.27", book: "Genesis", chapter: 1, verse: 27, text: "So God created man in his own image, in the image of God created he him; male and female created he them.", translation: "KJV" },
  { id: "gen.1.28", book: "Genesis", chapter: 1, verse: 28, text: "And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.", translation: "KJV" },
  { id: "gen.1.29", book: "Genesis", chapter: 1, verse: 29, text: "And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.", translation: "KJV" },
  { id: "gen.1.30", book: "Genesis", chapter: 1, verse: 30, text: "And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.", translation: "KJV" },
  { id: "gen.1.31", book: "Genesis", chapter: 1, verse: 31, text: "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.", translation: "KJV" }
];

// Pericope divisions based on creation days
export const genesis1Pericopes: Pericope[] = [
  {
    id: "gen.1.creation-setup",
    title: "Creation Setup",
    description: "In the beginning, God creates the heavens and earth - the formless, void starting point",
    book: "Genesis",
    chapter: 1,
    startVerse: 1,
    endVerse: 2,
    verseIds: ["gen.1.1", "gen.1.2"],
    theme: "creation"
  },
  {
    id: "gen.1.day-1",
    title: "Day 1: Light and Darkness",
    description: "God creates light and separates it from darkness, establishing day and night",
    book: "Genesis",
    chapter: 1,
    startVerse: 3,
    endVerse: 5,
    verseIds: ["gen.1.3", "gen.1.4", "gen.1.5"],
    theme: "creation"
  },
  {
    id: "gen.1.day-2",
    title: "Day 2: Sky and Waters",
    description: "God creates the firmament to separate waters above from waters below",
    book: "Genesis",
    chapter: 1,
    startVerse: 6,
    endVerse: 8,
    verseIds: ["gen.1.6", "gen.1.7", "gen.1.8"],
    theme: "creation"
  },
  {
    id: "gen.1.day-3",
    title: "Day 3: Land and Vegetation",
    description: "God creates dry land and all plant life - grass, herbs, and fruit trees",
    book: "Genesis",
    chapter: 1,
    startVerse: 9,
    endVerse: 13,
    verseIds: ["gen.1.9", "gen.1.10", "gen.1.11", "gen.1.12", "gen.1.13"],
    theme: "creation"
  },
  {
    id: "gen.1.day-4",
    title: "Day 4: Sun, Moon, and Stars",
    description: "God creates the lights in the heavens - sun, moon, and stars for times and seasons",
    book: "Genesis",
    chapter: 1,
    startVerse: 14,
    endVerse: 19,
    verseIds: ["gen.1.14", "gen.1.15", "gen.1.16", "gen.1.17", "gen.1.18", "gen.1.19"],
    theme: "creation"
  },
  {
    id: "gen.1.day-5",
    title: "Day 5: Fish and Birds",
    description: "God creates sea creatures and birds, blessing them to be fruitful and multiply",
    book: "Genesis",
    chapter: 1,
    startVerse: 20,
    endVerse: 23,
    verseIds: ["gen.1.20", "gen.1.21", "gen.1.22", "gen.1.23"],
    theme: "creation"
  },
  {
    id: "gen.1.day-6a",
    title: "Day 6a: Land Animals",
    description: "God creates all land animals - livestock, wild beasts, and creeping things",
    book: "Genesis",
    chapter: 1,
    startVerse: 24,
    endVerse: 25,
    verseIds: ["gen.1.24", "gen.1.25"],
    theme: "creation"
  },
  {
    id: "gen.1.day-6b",
    title: "Day 6b: Humanity",
    description: "God creates mankind in His image, giving them dominion and providing food",
    book: "Genesis",
    chapter: 1,
    startVerse: 26,
    endVerse: 31,
    verseIds: ["gen.1.26", "gen.1.27", "gen.1.28", "gen.1.29", "gen.1.30", "gen.1.31"],
    theme: "creation"
  }
];

// Complete Genesis 1 chapter
export const genesis1Chapter: Chapter = {
  id: "gen.1",
  book: "Genesis",
  chapter: 1,
  title: "The Creation of the World",
  totalVerses: 31,
  pericopes: genesis1Pericopes,
  verseIds: genesis1Verses.map(v => v.id)
};

// Sample recall questions for Genesis 1
export const genesis1Questions: RecallQuestion[] = [
  {
    id: "q.gen.1.1.creation",
    verseId: "gen.1.1",
    pericopeId: "gen.1.creation-setup",
    type: "completion",
    question: "Complete the verse: 'In the beginning...'",
    answer: "In the beginning God created the heaven and the earth."
  },
  {
    id: "q.gen.1.3.light",
    verseId: "gen.1.3",
    pericopeId: "gen.1.day-1",
    type: "context",
    question: "What did God create on Day 1?",
    answer: "Light"
  },
  {
    id: "q.gen.1.27.image",
    verseId: "gen.1.27",
    pericopeId: "gen.1.day-6b",
    type: "meaning",
    question: "In whose image was man created?",
    answer: "God's image"
  },
  {
    id: "q.gen.1.day-3.vegetation",
    verseId: "gen.1.11",
    pericopeId: "gen.1.day-3",
    type: "context",
    question: "What did God create on Day 3 besides dry land?",
    answer: "Grass, herbs yielding seed, and fruit trees"
  }
];