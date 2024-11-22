// LocationTracker.js
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const LocationTracker = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [onlineLocations, setOnlineLocations] = useState([]);
    const [offlineLocations, setOfflineLocations] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        loadOfflineLocations();
    }, []);

    const loadOfflineLocations = async () => {
        try {
            const stored = await AsyncStorage.getItem('offlineLocations');
            if (stored) {
                setOfflineLocations(JSON.parse(stored));
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load offline locations');
        }
    };

    const getLocation = async () => {
        console.log('Getting Location...');
        setLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please grant location permissions');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            const newLocation = {
                id: Date.now().toString(),
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                timestamp: new Date().toISOString(),
            };

            const isConnected = await NetInfo.fetch();
            if (isConnected.isConnected) {
                setOnlineLocations(prev => [...prev, newLocation]);
                // Here you would typically send to your server
            } else {
                const updatedOffline = [...offlineLocations, newLocation];
                setOfflineLocations(updatedOffline);
                await AsyncStorage.setItem('offlineLocations', JSON.stringify(updatedOffline));
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to get location');
        } finally {
            setLoading(false);
        }
    };

    const syncLocations = async () => {
        setIsSyncing(true);
        try {
            const isConnected = await NetInfo.fetch();
            if (!isConnected.isConnected) {
                console.error('Sync Failed: No Internet Connection');
                Alert.alert('No Connection', 'Please check your internet connection');
                return;
            }

            console.log('Sync Started');
            console.log('Offline Locations to Sync:', offlineLocations.length);

            // Simulate API call to sync locations
            // Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Log details of locations being synced
            offlineLocations.forEach((location, index) => {
                console.log(`Syncing Location ${index + 1}:`, {
                    id: location.id,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    timestamp: location.timestamp
                });
            });

            // Update online and offline locations
            const updatedOnlineLocations = [...onlineLocations, ...offlineLocations];
            setOnlineLocations(updatedOnlineLocations);
            setOfflineLocations([]);

            // Persist changes
            await AsyncStorage.setItem('offlineLocations', JSON.stringify([]));

            console.log('Sync Completed');
            console.log('Total Online Locations:', updatedOnlineLocations.length);

            Alert.alert('Success', 'Locations synced successfully');
        } catch (error) {
            console.error('Sync Error:', error);
            Alert.alert('Error', 'Failed to sync locations');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, styles.getLocationButton]}
                onPress={getLocation}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Getting Location...' : 'Get Location'}
                </Text>
            </TouchableOpacity>

            <View style={styles.locationInfo}>
                <Text style={styles.locationText}>Online Locations ({onlineLocations.length})</Text>
                {onlineLocations.map(loc => (
                    <Text key={loc.id}>
                        Lat: {loc.latitude.toFixed(5)}, Long: {loc.longitude.toFixed(5)}
                    </Text>
                ))}
            </View>

            <View style={styles.locationInfo}>
                <Text style={styles.locationText}>Offline Locations ({offlineLocations.length})</Text>
                {offlineLocations.map(loc => (
                    <Text key={loc.id}>
                        Lat: {loc.latitude.toFixed(5)}, Long: {loc.longitude.toFixed(5)}
                    </Text>
                ))}
            </View>

            {offlineLocations.length > 0 && (
                <TouchableOpacity
                    style={[styles.button, styles.syncButton]}
                    onPress={syncLocations}
                    disabled={isSyncing}
                >
                    <Text style={styles.buttonText}>
                        {isSyncing ? 'Syncing...' : 'Sync Offline Locations'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    getLocationButton: {
        backgroundColor: '#007AFF',
    },
    syncButton: {
        backgroundColor: '#34C759',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    locationInfo: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        width: '80%',
    },
    locationText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
});

export default LocationTracker;