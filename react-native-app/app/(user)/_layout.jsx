import { Image, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { icons, images } from '../../constants'

const UserLayout = () => {
  return (
   <>

   {/* User Routes */}
    <Stack>

      <Stack.Screen
        name='user-dashboard'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='user-profile'
        options={{
          headerShown: false
        }}
      />

    </Stack>
   </>
  )
}

export default UserLayout