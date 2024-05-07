import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const Dashboard = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Landfill Dashboard</Text>
        <Link href='landfill-profile'>
          <Text>Go to Profile</Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}

export default Dashboard