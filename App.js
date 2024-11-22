// App.js
import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import LocationTracker from './src/LocationTracker';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={true}
      >
        <LocationTracker />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
  },
});