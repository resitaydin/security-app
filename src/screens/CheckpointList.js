import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckpointBox } from '../components/CheckpointBox';
import { useCheckpoints } from '../hooks/useCheckpoints';

const CheckpointList = () => {
    const navigation = useNavigation();
    const { checkpoints, loadCheckpoints } = useCheckpoints();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await loadCheckpoints(); // This will now update the state with fresh data
        } catch (error) {
            console.error('Error refreshing checkpoints:', error);
        } finally {
            setRefreshing(false);
        }
    }, [loadCheckpoints]);

    // Also refresh when screen comes into focus
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        return unsubscribe;
    }, [navigation, onRefresh]);

    const handleCheckpointPress = (checkpoint) => {
        navigation.navigate('CheckpointVerification', { checkpoint });
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#007AFF']} // Android
                    tintColor="#007AFF" // iOS
                    title="Pull to refresh" // iOS
                    titleColor="#007AFF" // iOS
                />
            }
        >
            {checkpoints.map((checkpoint) => (
                <CheckpointBox
                    key={checkpoint.id}
                    checkpoint={checkpoint}
                    onPress={() => handleCheckpointPress(checkpoint)}
                />
            ))}

            {/* Supervisor Mode Button */}
            <TouchableOpacity
                style={styles.supervisorButton}
                onPress={() => navigation.navigate('SupervisorSetup')}
            >
                <Text style={styles.supervisorButtonText}>Supervisor Mode</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    supervisorButton: {
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: '#FF9500',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'flex-end',
    },
    supervisorButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CheckpointList;