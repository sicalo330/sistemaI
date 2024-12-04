import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

function LoadingScreen(){
    return (
        <View style={styles.loadingContainer}>{/*Esto es lo que se muestra en la panalla de carga*/}
            <ActivityIndicator size="large" color="#FFA726" />
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
