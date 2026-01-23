import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { funFacts, getFactsForSpecies } from '../data/funFacts';
import { Species, FunFact } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

const speciesOptions: { value: Species | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🐾' },
  { value: 'dog', label: 'Dogs', emoji: '🐕' },
  { value: 'cat', label: 'Cats', emoji: '🐱' },
  { value: 'rabbit', label: 'Rabbits', emoji: '🐰' },
  { value: 'fish', label: 'Fish', emoji: '🐠' },
  { value: 'bird', label: 'Birds', emoji: '🐦' },
  { value: 'hamster', label: 'Hamsters', emoji: '🐹' },
  { value: 'guinea_pig', label: 'Guinea Pigs', emoji: '🐹' },
  { value: 'reptile', label: 'Reptiles', emoji: '🦎' },
];

const categoryColors: Record<string, string> = {
  nutrition: '#4CAF50',
  behavior: '#2196F3',
  history: '#9C27B0',
  care: '#FF9800',
};

export default function FunFactsScreen() {
  const { favoriteFacts, toggleFavoriteFact } = useApp();
  const [selectedSpecies, setSelectedSpecies] = useState<Species | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const displayedFacts = (selectedSpecies === 'all' ? funFacts : getFactsForSpecies(selectedSpecies))
    .filter(fact => !showFavoritesOnly || favoriteFacts.includes(fact.id));

  function renderFactCard({ item, index }: { item: FunFact; index: number }) {
    const isFavorite = favoriteFacts.includes(item.id);
    const speciesOption = speciesOptions.find(s => s.value === item.species);

    return (
      <View style={styles.factCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColors[item.category] }]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleFavoriteFact(item.id)}>
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.factContent}>{item.content}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesEmoji}>{speciesOption?.emoji}</Text>
            <Text style={styles.speciesLabel}>{speciesOption?.label}</Text>
          </View>
          <Text style={styles.cardNumber}>
            {index + 1} / {displayedFacts.length}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fun Facts</Text>
        <TouchableOpacity
          style={[styles.favButton, showFavoritesOnly && styles.favButtonActive]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Text style={styles.favButtonText}>{showFavoritesOnly ? '❤️' : '🤍'} Favorites</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.speciesFilter}>
        <FlatList
          horizontal
          data={speciesOptions}
          keyExtractor={item => item.value}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.speciesButton,
                selectedSpecies === item.value && styles.speciesButtonActive,
              ]}
              onPress={() => {
                setSelectedSpecies(item.value);
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
              }}
            >
              <Text style={styles.speciesButtonEmoji}>{item.emoji}</Text>
              <Text
                style={[
                  styles.speciesButtonLabel,
                  selectedSpecies === item.value && styles.speciesButtonLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.speciesFilterContent}
        />
      </View>

      {displayedFacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💡</Text>
          <Text style={styles.emptyText}>
            {showFavoritesOnly ? 'No favorite facts yet' : 'No facts available'}
          </Text>
          <Text style={styles.emptySubtext}>
            {showFavoritesOnly
              ? 'Tap the heart icon on any fact to add it to your favorites'
              : 'Select a different species to see facts'}
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={displayedFacts}
          renderItem={renderFactCard}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          contentContainerStyle={styles.factsList}
        />
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>← Swipe to browse facts →</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#4a90d9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  favButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  favButtonActive: {
    backgroundColor: '#fff',
  },
  favButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  speciesFilter: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  speciesFilterContent: {
    paddingHorizontal: 12,
  },
  speciesButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  speciesButtonActive: {
    backgroundColor: '#e8f4fd',
  },
  speciesButtonEmoji: {
    fontSize: 24,
  },
  speciesButtonLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  speciesButtonLabelActive: {
    color: '#4a90d9',
    fontWeight: '600',
  },
  factsList: {
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  factCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'space-between',
    minHeight: 280,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  factContent: {
    fontSize: 20,
    color: '#333',
    lineHeight: 30,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  speciesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  speciesEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  speciesLabel: {
    fontSize: 12,
    color: '#666',
  },
  cardNumber: {
    fontSize: 14,
    color: '#999',
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
  instructions: {
    padding: 16,
    alignItems: 'center',
  },
  instructionsText: {
    color: '#999',
    fontSize: 14,
  },
});
