import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { CheckpointForm } from '../components/CheckpointForm';
import { useCheckpoints } from '../hooks/useCheckpoints';

const SupervisorSetup = () => {
    const [isSettingLocation, setIsSettingLocation] = useState(false);
    const { addCheckpoint } = useCheckpoints();

    const handleSetLocation = async (name) => {
        setIsSettingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            await addCheckpoint({
                name,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                status: 'PENDING',
            });

            Alert.alert('Success', 'Checkpoint location set successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to set checkpoint location.');
        } finally {
            setIsSettingLocation(false);
        }
    };

    return (
        <View style={styles.container}>
            <CheckpointForm
                onSubmit={handleSetLocation}
                isSubmitting={isSettingLocation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default SupervisorSetup;