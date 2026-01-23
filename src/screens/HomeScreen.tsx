import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useApp } from '../context/AppContext';
import { Pet } from '../types';
import { getDailyFact } from '../data/funFacts';
import { format } from 'date-fns';

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

export default function HomeScreen({ navigation }: any) {
  const { pets, feedingLogs } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');

  function getTodaysFeedingCount(petId: string): number {
    return feedingLogs.filter(log => log.petId === petId && log.date === today).length;
  }

  function renderPetCard({ item }: { item: Pet }) {
    const dailyFact = getDailyFact(item.species);
    const fedCount = getTodaysFeedingCount(item.id);

    return (
      <TouchableOpacity
        style={styles.petCard}
        onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
      >
        <View style={styles.petHeader}>
          {item.photo ? (
            <Image source={{ uri: item.photo }} style={styles.petPhoto} />
          ) : (
            <View style={styles.petPhotoPlaceholder}>
              <Text style={styles.petEmoji}>{speciesEmoji[item.species]}</Text>
            </View>
          )}
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petSpecies}>{item.species.replace('_', ' ')}</Text>
            <Text style={styles.feedingStatus}>Fed {fedCount}x today</Text>
          </View>
        </View>
        {dailyFact && (
          <View style={styles.factBox}>
            <Text style={styles.factLabel}>Daily Tip</Text>
            <Text style={styles.factText} numberOfLines={2}>{dailyFact.content}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pet Care Companion</Text>
        <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
      </View>

      {pets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🐾</Text>
          <Text style={styles.emptyTitle}>No pets yet!</Text>
          <Text style={styles.emptyText}>Add your first pet to get started</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddPet')}
          >
            <Text style={styles.addButtonText}>Add Pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPetCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
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
  listContent: {
    padding: 16,
  },
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  petPhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 30,
  },
  petInfo: {
    marginLeft: 16,
    flex: 1,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  petSpecies: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  feedingStatus: {
    fontSize: 12,
    color: '#4a90d9',
    marginTop: 4,
  },
  factBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  factLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a90d9',
    marginBottom: 4,
  },
  factText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
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
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 24,
    backgroundColor: '#4a90d9',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
