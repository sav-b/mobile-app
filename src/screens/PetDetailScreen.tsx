import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { format } from 'date-fns';
import { generateUUID } from '../utils/uuid';
import { useApp } from '../context/AppContext';
import { getFactsForSpecies } from '../data/funFacts';
import { FunFact } from '../types';

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

export default function PetDetailScreen({ route, navigation }: any) {
  const { petId } = route.params;
  const { pets, schedules, feedingLogs, updateSchedule, logFeeding, deletePet, favoriteFacts, toggleFavoriteFact } = useApp();
  const pet = pets.find(p => p.id === petId);
  const schedule = schedules.find(s => s.petId === petId);
  const facts = pet ? getFactsForSpecies(pet.species) : [];
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLogs = feedingLogs.filter(log => log.petId === petId && log.date === today);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found</Text>
      </View>
    );
  }

  async function handleMarkFed(scheduledTime: string) {
    await logFeeding({
      id: generateUUID(),
      petId,
      scheduledTime,
      completedAt: new Date().toISOString(),
      date: today,
    });
  }

  async function handleAddTime() {
    if (!newTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      Alert.alert('Invalid Time', 'Please enter time in HH:MM format');
      return;
    }
    if (schedule) {
      await updateSchedule({
        ...schedule,
        times: [...schedule.times, newTime].sort(),
      });
    }
    setNewTime('');
    setShowScheduleModal(false);
  }

  async function handleRemoveTime(time: string) {
    if (schedule && schedule.times.length > 1) {
      await updateSchedule({
        ...schedule,
        times: schedule.times.filter(t => t !== time),
      });
    } else {
      Alert.alert('Cannot Remove', 'You need at least one feeding time');
    }
  }

  async function handleDeletePet() {
    if (!pet) return;
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePet(petId);
            navigation.goBack();
          },
        },
      ]
    );
  }

  function isTimeFed(time: string): boolean {
    return todayLogs.some(log => log.scheduledTime === time);
  }

  const currentFact: FunFact | undefined = facts[currentFactIndex];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {pet.photo ? (
          <Image source={{ uri: pet.photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.emoji}>{speciesEmoji[pet.species]}</Text>
          </View>
        )}
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.species}>{pet.species.replace('_', ' ')}</Text>
        {pet.breed && <Text style={styles.breed}>{pet.breed}</Text>}
        {pet.age && <Text style={styles.age}>{pet.age} years old</Text>}
      </View>

      {pet.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{pet.notes}</Text>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Feeding Schedule</Text>
          <TouchableOpacity onPress={() => setShowScheduleModal(true)}>
            <Text style={styles.addText}>+ Add Time</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.feedingTimes}>
          {schedule?.times.map(time => (
            <View key={time} style={styles.feedingTimeRow}>
              <View style={styles.timeInfo}>
                <Text style={styles.timeText}>{time}</Text>
                {isTimeFed(time) ? (
                  <Text style={styles.fedBadge}>Fed</Text>
                ) : (
                  <TouchableOpacity
                    style={styles.feedButton}
                    onPress={() => handleMarkFed(time)}
                  >
                    <Text style={styles.feedButtonText}>Mark Fed</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={() => handleRemoveTime(time)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.streakBox}>
          <Text style={styles.streakLabel}>Today's Progress</Text>
          <Text style={styles.streakValue}>
            {todayLogs.length} / {schedule?.times.length || 0} feedings
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fun Facts</Text>
        {currentFact && (
          <View style={styles.factCard}>
            <View style={styles.factHeader}>
              <Text style={styles.factCategory}>{currentFact.category}</Text>
              <TouchableOpacity onPress={() => toggleFavoriteFact(currentFact.id)}>
                <Text style={styles.favoriteIcon}>
                  {favoriteFacts.includes(currentFact.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.factContent}>{currentFact.content}</Text>
            <View style={styles.factNav}>
              <TouchableOpacity
                onPress={() => setCurrentFactIndex(i => (i - 1 + facts.length) % facts.length)}
                style={styles.factNavButton}
              >
                <Text style={styles.factNavText}>← Previous</Text>
              </TouchableOpacity>
              <Text style={styles.factCounter}>
                {currentFactIndex + 1} / {facts.length}
              </Text>
              <TouchableOpacity
                onPress={() => setCurrentFactIndex(i => (i + 1) % facts.length)}
                style={styles.factNavButton}
              >
                <Text style={styles.factNavText}>Next →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.journalButton}
          onPress={() => navigation.navigate('Journal', { petId })}
        >
          <Text style={styles.journalButtonText}>View Journal</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePet}>
        <Text style={styles.deleteButtonText}>Delete Pet</Text>
      </TouchableOpacity>

      <Modal visible={showScheduleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Feeding Time</Text>
            <TextInput
              style={styles.modalInput}
              value={newTime}
              onChangeText={setNewTime}
              placeholder="HH:MM (e.g., 14:30)"
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowScheduleModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleAddTime}>
                <Text style={styles.modalSaveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90d9',
    padding: 24,
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 50,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  species: {
    fontSize: 16,
    color: '#e0e0e0',
    textTransform: 'capitalize',
  },
  breed: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  age: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  addText: {
    color: '#4a90d9',
    fontWeight: '600',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  feedingTimes: {
    marginBottom: 12,
  },
  feedingTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
  },
  fedBadge: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  feedButton: {
    backgroundColor: '#4a90d9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  feedButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  removeText: {
    color: '#e74c3c',
    fontSize: 12,
  },
  streakBox: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a90d9',
    marginTop: 4,
  },
  factCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  factHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  factCategory: {
    fontSize: 12,
    color: '#4a90d9',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  factContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  factNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  factNavButton: {
    padding: 8,
  },
  factNavText: {
    color: '#4a90d9',
    fontWeight: '500',
  },
  factCounter: {
    color: '#999',
    fontSize: 12,
  },
  journalButton: {
    backgroundColor: '#4a90d9',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  journalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
    marginBottom: 40,
  },
  deleteButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#4a90d9',
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#fff',
    fontWeight: '600',
  },
});
