import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, FeedingSchedule, FeedingLog, JournalEntry } from '../types';
import * as storage from '../utils/storage';

interface AppContextType {
  pets: Pet[];
  schedules: FeedingSchedule[];
  feedingLogs: FeedingLog[];
  journalEntries: JournalEntry[];
  favoriteFacts: string[];
  loading: boolean;
  addPet: (pet: Pet) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  updateSchedule: (schedule: FeedingSchedule) => Promise<void>;
  logFeeding: (log: FeedingLog) => Promise<void>;
  addJournalEntry: (entry: JournalEntry) => Promise<void>;
  updateJournalEntry: (entry: JournalEntry) => Promise<void>;
  deleteJournalEntry: (entryId: string) => Promise<void>;
  toggleFavoriteFact: (factId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([]);
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [favoriteFacts, setFavoriteFacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [petsData, schedulesData, logsData, entriesData, favoritesData] = await Promise.all([
        storage.getPets(),
        storage.getSchedules(),
        storage.getFeedingLogs(),
        storage.getJournalEntries(),
        storage.getFavoriteFacts(),
      ]);
      setPets(petsData);
      setSchedules(schedulesData);
      setFeedingLogs(logsData);
      setJournalEntries(entriesData);
      setFavoriteFacts(favoritesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addPet(pet: Pet) {
    const newPets = [...pets, pet];
    setPets(newPets);
    await storage.savePets(newPets);
    
    const newSchedule: FeedingSchedule = {
      id: `schedule_${pet.id}`,
      petId: pet.id,
      times: ['08:00', '18:00'],
      enabled: true,
    };
    const newSchedules = [...schedules, newSchedule];
    setSchedules(newSchedules);
    await storage.saveSchedules(newSchedules);
  }

  async function updatePet(pet: Pet) {
    const newPets = pets.map(p => p.id === pet.id ? pet : p);
    setPets(newPets);
    await storage.savePets(newPets);
  }

  async function deletePet(petId: string) {
    const newPets = pets.filter(p => p.id !== petId);
    setPets(newPets);
    await storage.savePets(newPets);
    
    const newSchedules = schedules.filter(s => s.petId !== petId);
    setSchedules(newSchedules);
    await storage.saveSchedules(newSchedules);
    
    const newLogs = feedingLogs.filter(l => l.petId !== petId);
    setFeedingLogs(newLogs);
    await storage.saveFeedingLogs(newLogs);
    
    const newEntries = journalEntries.filter(e => e.petId !== petId);
    setJournalEntries(newEntries);
    await storage.saveJournalEntries(newEntries);
  }

  async function updateSchedule(schedule: FeedingSchedule) {
    const newSchedules = schedules.map(s => s.petId === schedule.petId ? schedule : s);
    setSchedules(newSchedules);
    await storage.saveSchedules(newSchedules);
  }

  async function logFeeding(log: FeedingLog) {
    const newLogs = [...feedingLogs, log];
    setFeedingLogs(newLogs);
    await storage.saveFeedingLogs(newLogs);
  }

  async function addJournalEntry(entry: JournalEntry) {
    const newEntries = [...journalEntries, entry];
    setJournalEntries(newEntries);
    await storage.saveJournalEntries(newEntries);
  }

  async function updateJournalEntry(entry: JournalEntry) {
    const newEntries = journalEntries.map(e => e.id === entry.id ? entry : e);
    setJournalEntries(newEntries);
    await storage.saveJournalEntries(newEntries);
  }

  async function deleteJournalEntry(entryId: string) {
    const newEntries = journalEntries.filter(e => e.id !== entryId);
    setJournalEntries(newEntries);
    await storage.saveJournalEntries(newEntries);
  }

  async function toggleFavoriteFact(factId: string) {
    const newFavorites = favoriteFacts.includes(factId)
      ? favoriteFacts.filter(id => id !== factId)
      : [...favoriteFacts, factId];
    setFavoriteFacts(newFavorites);
    await storage.saveFavoriteFacts(newFavorites);
  }

  return (
    <AppContext.Provider value={{
      pets,
      schedules,
      feedingLogs,
      journalEntries,
      favoriteFacts,
      loading,
      addPet,
      updatePet,
      deletePet,
      updateSchedule,
      logFeeding,
      addJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
      toggleFavoriteFact,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
