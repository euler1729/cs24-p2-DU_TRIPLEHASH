import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'expo-router'

const Dashboard = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: 'Dashboard',
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <View>
        <Text>Dashboard</Text>
      </View>
    </SafeAreaView>
  )
}

export default Dashboard