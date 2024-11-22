// src/components/LocationTracker.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';

const LocationTracker = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savedLocations, setSavedLocations] = useState([]);

    const getLocation = async () => {
        setLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Please grant location permissions to use this feature.',
                    [{ text: 'OK' }]
                );
                setLoading(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High, // Keeping it high for now
            });

            setLocation(currentLocation.coords);
            console.log('Location:', currentLocation);
        } catch (error) {
            console.log('Error:', error);
            Alert.alert('Error', 'Unable to get location');
        } finally {
            setLoading(false);
        }
    };

    const saveLocation = () => {
        if (!location) {
            Alert.alert('Error', 'Please get current location first');
            return;
        }

        const newLocation = {
            id: Date.now(), // temporary ID for now
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: new Date().toISOString(),
        };

        setSavedLocations([...savedLocations, newLocation]);
        Alert.alert('Success', 'Location saved successfully!');
        console.log('Saved Locations:', [...savedLocations, newLocation]);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={getLocation}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Getting Location...' : 'Get Current Location'}
                </Text>
            </TouchableOpacity>

            {location && (
                <>
                    <View style={styles.locationInfo}>
                        <Text style={styles.locationText}>Current Location:</Text>
                        <Text>Latitude: {location.latitude.toFixed(6)}</Text>
                        <Text>Longitude: {location.longitude.toFixed(6)}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={saveLocation}
                    >
                        <Text style={styles.buttonText}>Save This Location</Text>
                    </TouchableOpacity>
                </>
            )}

            {savedLocations.length > 0 && (
                <View style={styles.savedLocationsContainer}>
                    <Text style={styles.locationText}>Saved Locations:</Text>
                    {savedLocations.map((savedLoc) => (
                        <View key={savedLoc.id} style={styles.savedLocation}>
                            <Text>Latitude: {savedLoc.latitude.toFixed(6)}</Text>
                            <Text>Longitude: {savedLoc.longitude.toFixed(6)}</Text>
                            <Text>Time: {new Date(savedLoc.timestamp).toLocaleTimeString()}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButton: {
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
    savedLocationsContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        width: '80%',
    },
    savedLocation: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default LocationTracker;