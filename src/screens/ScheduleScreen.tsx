import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { format } from 'date-fns';
import { generateUUID } from '../utils/uuid';
import { useApp } from '../context/AppContext';
import { Pet } from '../types';

const speciesEmoji: Record<string, string> = {
  dog: '🐕',
  cat: '🐱',
  rabbit: '🐰',
  fish: '🐠',
  bird: '🐦',
  hamster: '🐹',
  guinea_pig: '🐹',
  reptile: '🦎',
};

export default function ScheduleScreen() {
  const { pets, schedules, feedingLogs, logFeeding } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentTime = format(new Date(), 'HH:mm');

  function getFeedingStatus(petId: string, time: string): 'completed' | 'pending' | 'upcoming' {
    const isFed = feedingLogs.some(
      log => log.petId === petId && log.date === today && log.scheduledTime === time
    );
    if (isFed) return 'completed';
    return time <= currentTime ? 'pending' : 'upcoming';
  }

  async function handleMarkFed(petId: string, time: string) {
    await logFeeding({
      id: generateUUID(),
      petId,
      scheduledTime: time,
      completedAt: new Date().toISOString(),
      date: today,
    });
  }

  interface ScheduleItem {
    petId: string;
    petName: string;
    petPhoto?: string;
    species: string;
    time: string;
    status: 'completed' | 'pending' | 'upcoming';
  }

  const allScheduleItems: ScheduleItem[] = pets.flatMap(pet => {
    const schedule = schedules.find(s => s.petId === pet.id);
    if (!schedule || !schedule.enabled) return [];
    return schedule.times.map(time => ({
      petId: pet.id,
      petName: pet.name,
      petPhoto: pet.photo,
      species: pet.species,
      time,
      status: getFeedingStatus(pet.id, time),
    }));
  }).sort((a, b) => a.time.localeCompare(b.time));

  const pendingCount = allScheduleItems.filter(item => item.status === 'pending').length;
  const completedCount = allScheduleItems.filter(item => item.status === 'completed').length;

  function renderScheduleItem({ item }: { item: ScheduleItem }) {
    return (
      <View style={[styles.scheduleItem, item.status === 'completed' && styles.scheduleItemCompleted]}>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, item.status === 'completed' && styles.timeCompleted]}>
            {item.time}
          </Text>
        </View>
        
        <View style={styles.petInfo}>
          {item.petPhoto ? (
            <Image source={{ uri: item.petPhoto }} style={styles.petPhoto} />
          ) : (
            <View style={styles.petPhotoPlaceholder}>
              <Text style={styles.petEmoji}>{speciesEmoji[item.species]}</Text>
            </View>
          )}
          <View style={styles.petDetails}>
            <Text style={[styles.petName, item.status === 'completed' && styles.textCompleted]}>
              {item.petName}
            </Text>
            <Text style={styles.petSpecies}>{item.species.replace('_', ' ')}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          {item.status === 'completed' ? (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Fed</Text>
            </View>
          ) : item.status === 'pending' ? (
            <TouchableOpacity
              style={styles.feedButton}
              onPress={() => handleMarkFed(item.petId, item.time)}
            >
              <Text style={styles.feedButtonText}>Mark Fed</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingText}>Upcoming</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Schedule</Text>
        <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, pendingCount > 0 && styles.statNumberPending]}>
            {pendingCount}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{allScheduleItems.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {allScheduleItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📅</Text>
          <Text style={styles.emptyText}>No feeding schedules</Text>
          <Text style={styles.emptySubtext}>Add a pet to set up feeding reminders</Text>
        </View>
      ) : (
        <FlatList
          data={allScheduleItems}
          renderItem={renderScheduleItem}
          keyExtractor={(item, index) => `${item.petId}-${item.time}-${index}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90d9',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statNumberPending: {
    color: '#FF9800',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleItemCompleted: {
    backgroundColor: '#f8fff8',
    opacity: 0.8,
  },
  timeContainer: {
    width: 60,
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  timeCompleted: {
    color: '#999',
  },
  petInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  petPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  petPhotoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 22,
  },
  petDetails: {
    marginLeft: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  textCompleted: {
    color: '#999',
  },
  petSpecies: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  statusContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  completedBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  feedButton: {
    backgroundColor: '#4a90d9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  feedButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  upcomingBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  upcomingText: {
    color: '#999',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
