import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AppBar = () => {
    return (
        <View style={styles.appBar}>
            <Text style={styles.title}>Location Tracker</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    appBar: {
        height: 56,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});