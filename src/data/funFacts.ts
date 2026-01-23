import { FunFact, Species } from '../types';

export const funFacts: FunFact[] = [
  // Dogs
  { id: 'd1', species: 'dog', category: 'behavior', content: 'Dogs have a sense of time and can tell the difference between one hour and five hours.' },
  { id: 'd2', species: 'dog', category: 'history', content: 'The Basenji is the only breed of dog that cannot bark.' },
  { id: 'd3', species: 'dog', category: 'nutrition', content: 'Dogs need a balanced diet of proteins, fats, carbohydrates, vitamins, and minerals.' },
  { id: 'd4', species: 'dog', category: 'care', content: 'Dogs should have their nails trimmed every 3-4 weeks to prevent discomfort.' },
  { id: 'd5', species: 'dog', category: 'behavior', content: 'Dogs can understand up to 250 words and gestures.' },
  { id: 'd6', species: 'dog', category: 'history', content: 'Dogs were the first animals to be domesticated, around 15,000 years ago.' },
  
  // Cats
  { id: 'c1', species: 'cat', category: 'behavior', content: 'Cats spend 70% of their lives sleeping - about 13-16 hours a day.' },
  { id: 'c2', species: 'cat', category: 'history', content: 'Ancient Egyptians would shave their eyebrows to mourn the death of their cats.' },
  { id: 'c3', species: 'cat', category: 'nutrition', content: 'Cats are obligate carnivores and need meat to survive.' },
  { id: 'c4', species: 'cat', category: 'care', content: 'Cats should have their litter box cleaned daily to prevent health issues.' },
  { id: 'c5', species: 'cat', category: 'behavior', content: 'A cat\'s purr vibrates at 25-150 Hz, which can promote healing.' },
  { id: 'c6', species: 'cat', category: 'history', content: 'Cats have been domesticated for about 4,000 years.' },
  
  // Rabbits
  { id: 'r1', species: 'rabbit', category: 'behavior', content: 'Rabbits "binky" when happy - they jump and twist in the air!' },
  { id: 'r2', species: 'rabbit', category: 'nutrition', content: 'Hay should make up 80% of a rabbit\'s diet for proper digestion.' },
  { id: 'r3', species: 'rabbit', category: 'care', content: 'Rabbits need their nails trimmed every 4-6 weeks.' },
  { id: 'r4', species: 'rabbit', category: 'history', content: 'Rabbits were first domesticated in the 5th century by French monks.' },
  { id: 'r5', species: 'rabbit', category: 'behavior', content: 'Rabbits can see nearly 360 degrees around them.' },
  { id: 'r6', species: 'rabbit', category: 'care', content: 'Rabbits are crepuscular - most active at dawn and dusk.' },
  
  // Fish
  { id: 'f1', species: 'fish', category: 'behavior', content: 'Fish can recognize their owners and may swim excitedly when they approach.' },
  { id: 'f2', species: 'fish', category: 'care', content: 'Most aquarium fish need 25% water changes weekly for optimal health.' },
  { id: 'f3', species: 'fish', category: 'nutrition', content: 'Overfeeding is the most common cause of fish death - feed only what they eat in 2 minutes.' },
  { id: 'f4', species: 'fish', category: 'history', content: 'Goldfish were one of the first fish to be domesticated, over 1,000 years ago in China.' },
  { id: 'f5', species: 'fish', category: 'behavior', content: 'Fish have memories that can last for months, not just seconds.' },
  { id: 'f6', species: 'fish', category: 'care', content: 'Bettas need at least 5 gallons of water, despite common misconceptions.' },
  
  // Birds
  { id: 'b1', species: 'bird', category: 'behavior', content: 'Parrots can live 50-80 years and form lifelong bonds with their owners.' },
  { id: 'b2', species: 'bird', category: 'nutrition', content: 'Seeds alone are not enough - birds need fruits, vegetables, and pellets.' },
  { id: 'b3', species: 'bird', category: 'care', content: 'Birds need 10-12 hours of sleep in a quiet, dark environment.' },
  { id: 'b4', species: 'bird', category: 'history', content: 'Budgerigars (budgies) are the third most popular pet in the world.' },
  { id: 'b5', species: 'bird', category: 'behavior', content: 'Birds can learn to associate words with their meanings.' },
  { id: 'b6', species: 'bird', category: 'care', content: 'Bird cages should be cleaned thoroughly at least once a week.' },
  
  // Hamsters
  { id: 'h1', species: 'hamster', category: 'behavior', content: 'Hamsters can run up to 5 miles on their wheel in a single night!' },
  { id: 'h2', species: 'hamster', category: 'nutrition', content: 'Hamsters store food in their cheek pouches, which can expand to triple their head size.' },
  { id: 'h3', species: 'hamster', category: 'care', content: 'Hamsters need a minimum of 450 square inches of floor space.' },
  { id: 'h4', species: 'hamster', category: 'history', content: 'Syrian hamsters were discovered in 1930 and all pet Syrians descend from one litter.' },
  { id: 'h5', species: 'hamster', category: 'behavior', content: 'Hamsters are nocturnal and most active during evening hours.' },
  { id: 'h6', species: 'hamster', category: 'care', content: 'Hamster teeth never stop growing - they need items to chew on.' },
  
  // Guinea Pigs
  { id: 'g1', species: 'guinea_pig', category: 'behavior', content: 'Guinea pigs "popcorn" when happy - jumping and twisting with joy!' },
  { id: 'g2', species: 'guinea_pig', category: 'nutrition', content: 'Guinea pigs cannot produce Vitamin C and need daily supplements.' },
  { id: 'g3', species: 'guinea_pig', category: 'care', content: 'Guinea pigs are social and should be kept in pairs or groups.' },
  { id: 'g4', species: 'guinea_pig', category: 'history', content: 'Guinea pigs were domesticated around 3000 BC in South America.' },
  { id: 'g5', species: 'guinea_pig', category: 'behavior', content: 'Guinea pigs purr like cats when content and happy.' },
  { id: 'g6', species: 'guinea_pig', category: 'care', content: 'Guinea pigs need unlimited hay for proper digestion.' },
  
  // Reptiles
  { id: 'rp1', species: 'reptile', category: 'behavior', content: 'Bearded dragons wave their arms as a sign of submission or acknowledgment.' },
  { id: 'rp2', species: 'reptile', category: 'care', content: 'Most reptiles need both a basking spot and a cooler area in their enclosure.' },
  { id: 'rp3', species: 'reptile', category: 'nutrition', content: 'Leopard geckos store fat in their tails for times when food is scarce.' },
  { id: 'rp4', species: 'reptile', category: 'history', content: 'Reptiles have been on Earth for over 300 million years.' },
  { id: 'rp5', species: 'reptile', category: 'behavior', content: 'Many reptiles can recognize their owners and show preferences.' },
  { id: 'rp6', species: 'reptile', category: 'care', content: 'UVB lighting is essential for most reptiles to metabolize calcium.' },
];

export function getFactsForSpecies(species: Species): FunFact[] {
  return funFacts.filter(fact => fact.species === species);
}

export function getRandomFact(species: Species): FunFact | null {
  const speciesFacts = getFactsForSpecies(species);
  if (speciesFacts.length === 0) return null;
  return speciesFacts[Math.floor(Math.random() * speciesFacts.length)];
}

export function getDailyFact(species: Species): FunFact | null {
  const speciesFacts = getFactsForSpecies(species);
  if (speciesFacts.length === 0) return null;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return speciesFacts[dayOfYear % speciesFacts.length];
}
