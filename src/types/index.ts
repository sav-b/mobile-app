export type Species = 
  | 'dog' 
  | 'cat' 
  | 'rabbit' 
  | 'fish' 
  | 'bird' 
  | 'hamster' 
  | 'guinea_pig' 
  | 'reptile';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  photo?: string;
  age?: number;
  breed?: string;
  notes?: string;
  createdAt: string;
}

export interface FeedingSchedule {
  id: string;
  petId: string;
  times: string[]; // HH:mm format
  enabled: boolean;
}

export interface FeedingLog {
  id: string;
  petId: string;
  scheduledTime: string;
  completedAt: string;
  date: string; // YYYY-MM-DD
}

export interface JournalEntry {
  id: string;
  petId: string;
  title: string;
  content: string;
  category: 'health' | 'behavior' | 'milestone' | 'general';
  photos: string[];
  createdAt: string;
}

export interface FunFact {
  id: string;
  species: Species;
  category: 'nutrition' | 'behavior' | 'history' | 'care';
  content: string;
}
