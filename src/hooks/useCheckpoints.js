import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCheckpoints = () => {
    const [checkpoints, setCheckpoints] = useState([]);

    const loadCheckpoints = useCallback(async () => {
        try {
            const stored = await AsyncStorage.getItem('checkpoints');
            if (stored) {
                const parsedCheckpoints = JSON.parse(stored);
                setCheckpoints(parsedCheckpoints);
                return parsedCheckpoints; // Return the loaded data
            }
            return [];
        } catch (error) {
            console.error('Error loading checkpoints:', error);
            return [];
        }
    }, []);

    // Load checkpoints on initial mount
    useEffect(() => {
        loadCheckpoints();
    }, []);

    const saveCheckpoints = async (updatedCheckpoints) => {
        try {
            await AsyncStorage.setItem('checkpoints', JSON.stringify(updatedCheckpoints));
            setCheckpoints(updatedCheckpoints);
        } catch (error) {
            console.error('Error saving checkpoints:', error);
            throw error;
        }
    };

    const addCheckpoint = async (checkpoint) => {
        try {
            const newCheckpoint = {
                id: Date.now().toString(),
                ...checkpoint,
            };
            const updatedCheckpoints = [...checkpoints, newCheckpoint];
            await saveCheckpoints(updatedCheckpoints);
            return newCheckpoint;
        } catch (error) {
            console.error('Error adding checkpoint:', error);
            throw error;
        }
    };

    const updateCheckpointStatus = async (id, status) => {
        try {
            const updated = checkpoints.map(cp =>
                cp.id === id ? { ...cp, status } : cp
            );
            await saveCheckpoints(updated);
        } catch (error) {
            console.error('Error updating checkpoint status:', error);
            throw error;
        }
    };

    return {
        checkpoints,
        addCheckpoint,
        updateCheckpointStatus,
        loadCheckpoints, // Export the load function directly
    };
};