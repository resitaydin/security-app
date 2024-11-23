import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export const CheckpointForm = ({ onSubmit, isSubmitting }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit(name.trim());
            setName('');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Checkpoint Name"
                value={name}
                onChangeText={setName}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={isSubmitting || !name.trim()}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Set Location</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 15,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});