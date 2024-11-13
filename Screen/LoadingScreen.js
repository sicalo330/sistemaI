import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = ({ message = "Cargando datos..." }) => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFA726" />
            <Text>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
});

export default LoadingScreen;
