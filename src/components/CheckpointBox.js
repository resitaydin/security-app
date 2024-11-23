import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const CheckpointBox = ({ checkpoint, onPress }) => {
    const isCompleted = checkpoint.status === 'COMPLETED';

    return (
        <TouchableOpacity
            style={[styles.container, isCompleted && styles.completed]}
            onPress={onPress}
        >
            <Text style={styles.name}>{checkpoint.name}</Text>
            {isCompleted && (
                <Feather name="check-circle" size={24} color="#34C759" />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    completed: {
        backgroundColor: '#f8fff8',
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
    },
});