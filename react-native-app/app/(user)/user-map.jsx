import React from 'react';
import MapView from 'react-native-maps';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {Colors} from '../../assets/configs.json'

export default function Map() {
  return (
    <>
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
      <StatusBar
        hidden={false}
        style="auto"
        backgroundColor={Colors.greenWhite}
        translucent={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
