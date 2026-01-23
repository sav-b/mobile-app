import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import { generateUUID } from '../utils/uuid';
import { useApp } from '../context/AppContext';
import { JournalEntry } from '../types';

const categories = [
  { value: 'health', label: 'Health', emoji: '🏥' },
  { value: 'behavior', label: 'Behavior', emoji: '🐾' },
  { value: 'milestone', label: 'Milestone', emoji: '🎉' },
  { value: 'general', label: 'General', emoji: '📝' },
] as const;

export default function JournalScreen({ route }: any) {
  const { petId } = route.params;
  const { pets, journalEntries, addJournalEntry, deleteJournalEntry } = useApp();
  const pet = pets.find(p => p.id === petId);
  const entries = journalEntries
    .filter(e => e.petId === petId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<JournalEntry['category']>('general');
  const [photos, setPhotos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<JournalEntry['category'] | 'all'>('all');

  const filteredEntries = entries.filter(entry => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotos([...photos, ...result.assets.map(a => a.uri)]);
    }
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please enter a title and content');
      return;
    }

    await addJournalEntry({
      id: generateUUID(),
      petId,
      title: title.trim(),
      content: content.trim(),
      category,
      photos,
      createdAt: new Date().toISOString(),
    });

    setTitle('');
    setContent('');
    setCategory('general');
    setPhotos([]);
    setShowModal(false);
  }

  function handleDelete(entryId: string) {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteJournalEntry(entryId),
      },
    ]);
  }

  function getCategoryEmoji(cat: string): string {
    return categories.find(c => c.value === cat)?.emoji || '📝';
  }

  function renderEntry({ item }: { item: JournalEntry }) {
    return (
      <View style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryEmoji}>{getCategoryEmoji(item.category)}</Text>
          <View style={styles.entryMeta}>
            <Text style={styles.entryTitle}>{item.title}</Text>
            <Text style={styles.entryDate}>
              {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteIcon}>×</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.entryContent}>{item.content}</Text>
        {item.photos.length > 0 && (
          <View style={styles.photoRow}>
            {item.photos.slice(0, 3).map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.entryPhoto} />
            ))}
            {item.photos.length > 3 && (
              <View style={styles.morePhotos}>
                <Text style={styles.morePhotosText}>+{item.photos.length - 3}</Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{pet?.name}'s Journal</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <Text style={styles.addButtonText}>+ New Entry</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search entries..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, filterCategory === 'all' && styles.filterButtonActive]}
          onPress={() => setFilterCategory('all')}
        >
          <Text style={[styles.filterText, filterCategory === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.filterButton, filterCategory === cat.value && styles.filterButtonActive]}
            onPress={() => setFilterCategory(cat.value)}
          >
            <Text
              style={[styles.filterText, filterCategory === cat.value && styles.filterTextActive]}
            >
              {cat.emoji}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📔</Text>
          <Text style={styles.emptyText}>No journal entries yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "+ New Entry" to start documenting your pet's journey
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEntries}
          renderItem={renderEntry}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Entry</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Entry title"
            placeholderTextColor="#999"
          />

          <View style={styles.categoryPicker}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryOption,
                  category === cat.value && styles.categoryOptionActive,
                ]}
                onPress={() => setCategory(cat.value)}
              >
                <Text style={styles.categoryOptionEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryOptionLabel,
                    category === cat.value && styles.categoryOptionLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Write your entry..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />

          <View style={styles.photosSection}>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonText}>📷 Add Photos</Text>
            </TouchableOpacity>
            {photos.length > 0 && (
              <View style={styles.selectedPhotos}>
                {photos.map((photo, index) => (
                  <View key={index} style={styles.selectedPhotoWrapper}>
                    <Image source={{ uri: photo }} style={styles.selectedPhoto} />
                    <TouchableOpacity
                      style={styles.removePhoto}
                      onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                    >
                      <Text style={styles.removePhotoText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4a90d9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  searchBar: {
    padding: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  filterButtonActive: {
    backgroundColor: '#4a90d9',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  entryMeta: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  entryDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  deleteIcon: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
  entryContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  photoRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  entryPhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  morePhotos: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosText: {
    color: '#666',
    fontWeight: '600',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
  saveText: {
    color: '#4a90d9',
    fontSize: 16,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 18,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryPicker: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
  },
  categoryOptionActive: {
    backgroundColor: '#e8f4fd',
  },
  categoryOptionEmoji: {
    fontSize: 20,
  },
  categoryOptionLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  categoryOptionLabelActive: {
    color: '#4a90d9',
    fontWeight: '600',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    lineHeight: 24,
  },
  photosSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  photoButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedPhotos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  selectedPhotoWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedPhoto: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  removePhoto: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#e74c3c',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
