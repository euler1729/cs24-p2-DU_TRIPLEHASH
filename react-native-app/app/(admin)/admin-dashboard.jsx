import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

const Dashboard = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Dashboard</Text>

        <Link href='admin-profile'>
          <Text>Go to Profile</Text>
          <Text>Hello</Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}

export default Dashboard