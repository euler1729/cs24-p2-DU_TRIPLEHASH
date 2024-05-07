import { Image, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { icons, images } from '../../constants'

const LandfillLayout = () => {
  return (
   <>

   {/* Admin Routes */}
    <Stack>

      <Stack.Screen
        name='landfill-dashboard'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='landfill-profile'
        options={{
          headerShown: false
        }}
      />

    </Stack>
   </>
  )
}

export default LandfillLayout