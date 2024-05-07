import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

const Dashboard = () => {
  return (
    <SafeAreaView>
      <Text>STS Dashboard</Text>
      <Link href='sts-profile'>
        <Text>Go to Profile</Text>
      </Link>
    </SafeAreaView>
  )
}

export default Dashboard