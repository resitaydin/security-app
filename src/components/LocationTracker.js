import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationTracker = () => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedLocations();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const loadSavedLocations = async () => {
    try {
      const stored = await AsyncStorage.getItem('locations');
      if (stored) {
        setSavedLocations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const saveLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please grant location permissions to use this feature.',
          [{ text: 'OK' }]
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newLocation = {
        id: Date.now(),
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        altitude: currentLocation.coords.altitude,
        timestamp: new Date().toISOString(),
        synced: isOnline,
      };

      const updatedLocations = [...savedLocations, newLocation];
      setSavedLocations(updatedLocations);
      await AsyncStorage.setItem('locations', JSON.stringify(updatedLocations));

      Alert.alert(
        'Success',
        isOnline
          ? 'Location saved successfully!'
          : 'Location saved locally. Use sync button when online to upload.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Unable to save location');
    } finally {
      setIsLoading(false);
    }
  };

  const syncOfflineLocations = async () => {
    if (!isOnline) {
      Alert.alert('Error', 'Please connect to the internet to sync locations');
      return;
    }

    const unsynced = savedLocations.filter(loc => !loc.synced);
    if (unsynced.length === 0) {
      Alert.alert('Info', 'No locations to sync');
      return;
    }

    setIsSyncing(true);
    try {
      // Simulate API call to sync locations
      // In real app, you would make API calls here
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedLocations = savedLocations.map(loc => ({
        ...loc,
        synced: true
      }));

      setSavedLocations(updatedLocations);
      await AsyncStorage.setItem('locations', JSON.stringify(updatedLocations));

      Alert.alert('Success', `${unsynced.length} locations synced successfully`);
    } catch (error) {
      console.error('Error syncing locations:', error);
      Alert.alert('Error', 'Failed to sync locations');
    } finally {
      setIsSyncing(false);
    }
  };

  const getUnsyncedCount = () => {
    return savedLocations.filter(loc => !loc.synced).length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusBar}>
          <Text style={[
            styles.statusText,
            { color: isOnline ? '#34C759' : '#FF3B30' }
          ]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={saveLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Current Location</Text>
            )}
          </TouchableOpacity>

          {getUnsyncedCount() > 0 && (
            <TouchableOpacity
              style={[styles.syncButton, isSyncing && styles.buttonDisabled]}
              onPress={syncOfflineLocations}
              disabled={isSyncing || !isOnline}
            >
              {isSyncing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Sync ({getUnsyncedCount()} pending)
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {savedLocations.length > 0 ? (
          <View style={styles.savedLocationsContainer}>
            <Text style={styles.locationText}>Saved Locations:</Text>
            {savedLocations.map((savedLoc) => (
              <View key={savedLoc.id} style={styles.savedLocation}>
                <Text>Latitude: {savedLoc.latitude.toFixed(6)}</Text>
                <Text>Longitude: {savedLoc.longitude.toFixed(6)}</Text>
                <Text>Altitude: {savedLoc.altitude?.toFixed(3) || 'N/A'} meters</Text>
                <Text>Time: {new Date(savedLoc.timestamp).toLocaleTimeString()}</Text>
                <Text style={[
                  styles.syncIndicator,
                  { color: savedLoc.synced ? '#34C759' : '#FF9500' }
                ]}>
                  {savedLoc.synced ? 'Synced' : 'Pending Sync'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No saved locations yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  syncButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  savedLocationsContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
  },
  savedLocation: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  syncIndicator: {
    marginTop: 5,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 20,
  },
});

export default LocationTracker;