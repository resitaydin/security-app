import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CheckpointStatus } from '../types';

export const LocationVerifier = ({ checkpoint, onVerify, isVerifying }) => {
    const [verificationError, setVerificationError] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(checkpoint.status);

    const isCompleted = currentStatus === CheckpointStatus.COMPLETED;

    const handleVerification = async () => {
        // Reset any previous error
        setVerificationError(null);

        // Check if checkpoint is already verified
        if (isCompleted) {
            const errorMessage = 'This checkpoint has already been verified';
            setVerificationError(errorMessage);
            Alert.alert(
                'Already Verified',
                errorMessage,
                [{ text: 'OK' }]
            );
            return;
        }

        // Proceed with verification if not already verified
        try {
            await onVerify();
            // Update local status after successful verification
            setCurrentStatus(CheckpointStatus.COMPLETED);
            Alert.alert(
                'Success',
                'Location verified successfully!',
                [{ text: 'OK' }]
            );
        } catch (error) {
            setVerificationError(error.message);
            Alert.alert('Error', error.message);
        }
    };

    // Update local status if checkpoint status changes externally
    React.useEffect(() => {
        setCurrentStatus(checkpoint.status);
    }, [checkpoint.status]);

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{checkpoint.name}</Text>
                <Text style={styles.subtitle}>
                    Please verify you are at this checkpoint location
                </Text>
                {verificationError && (
                    <Text style={styles.errorText}>{verificationError}</Text>
                )}
                {isCompleted && (
                    <View style={styles.verifiedBadge}>
                        <Feather name="check-circle" size={20} color="#34C759" />
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.verifyButton,
                    isCompleted && styles.verifyButtonDisabled
                ]}
                onPress={handleVerification}
                disabled={isVerifying || isCompleted}
            >
                {isVerifying ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Feather
                            name={isCompleted ? "check" : "map-pin"}
                            size={24}
                            color="#fff"
                        />
                        <Text style={styles.verifyText}>
                            {isCompleted ? 'Verified' : 'Verify Location'}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#34C75911',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginTop: 10,
        gap: 6,
    },
    verifiedText: {
        color: '#34C759',
        fontSize: 14,
        fontWeight: '600',
    },
    verifyButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        gap: 10,
    },
    verifyButtonDisabled: {
        backgroundColor: '#34C759',
        opacity: 0.8,
    },
    verifyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});