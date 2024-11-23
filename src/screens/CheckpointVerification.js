import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { LocationVerifier } from '../components/LocationVerifier';
import { useCheckpoints } from '../hooks/useCheckpoints';
import { calculateDistance } from '../utils/locationUtils';
import { MAX_DISTANCE_METERS } from '../constants';

const CheckpointVerification = () => {
    const route = useRoute();
    const { checkpoint } = route.params;
    const [isVerifying, setIsVerifying] = useState(false);
    const { updateCheckpointStatus } = useCheckpoints();

    const verifyLocation = async () => {
        setIsVerifying(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const distance = calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                checkpoint.latitude,
                checkpoint.longitude
            );

            if (distance <= MAX_DISTANCE_METERS) {
                await updateCheckpointStatus(checkpoint.id, 'COMPLETED');
                Alert.alert('Success', 'Location verified successfully!');
            } else {
                Alert.alert('Error', `You must be within ${MAX_DISTANCE_METERS} meters of the checkpoint.`);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to verify location.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <View style={styles.container}>
            <LocationVerifier
                checkpoint={checkpoint}
                onVerify={verifyLocation}
                isVerifying={isVerifying}
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

export default CheckpointVerification;