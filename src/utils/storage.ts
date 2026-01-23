import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, FeedingSchedule, FeedingLog, JournalEntry } from '../types';

const KEYS = {
  PETS: '@petcare_pets',
  SCHEDULES: '@petcare_schedules',
  FEEDING_LOGS: '@petcare_feeding_logs',
  JOURNAL: '@petcare_journal',
  FAVORITE_FACTS: '@petcare_favorite_facts',
};

export async function getPets(): Promise<Pet[]> {
  const data = await AsyncStorage.getItem(KEYS.PETS);
  return data ? JSON.parse(data) : [];
}

export async function savePets(pets: Pet[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.PETS, JSON.stringify(pets));
}

export async function getSchedules(): Promise<FeedingSchedule[]> {
  const data = await AsyncStorage.getItem(KEYS.SCHEDULES);
  return data ? JSON.parse(data) : [];
}

export async function saveSchedules(schedules: FeedingSchedule[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.SCHEDULES, JSON.stringify(schedules));
}

export async function getFeedingLogs(): Promise<FeedingLog[]> {
  const data = await AsyncStorage.getItem(KEYS.FEEDING_LOGS);
  return data ? JSON.parse(data) : [];
}

export async function saveFeedingLogs(logs: FeedingLog[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.FEEDING_LOGS, JSON.stringify(logs));
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const data = await AsyncStorage.getItem(KEYS.JOURNAL);
  return data ? JSON.parse(data) : [];
}

export async function saveJournalEntries(entries: JournalEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.JOURNAL, JSON.stringify(entries));
}

export async function getFavoriteFacts(): Promise<string[]> {
  const data = await AsyncStorage.getItem(KEYS.FAVORITE_FACTS);
  return data ? JSON.parse(data) : [];
}

export async function saveFavoriteFacts(factIds: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.FAVORITE_FACTS, JSON.stringify(factIds));
}
