import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

const Dashboard = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>User Dashboard</Text>
        <Link href='user-profile'>
          <Text>Go to Profile</Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}

export default Dashboard