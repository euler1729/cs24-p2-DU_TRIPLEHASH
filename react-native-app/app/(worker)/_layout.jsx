import { Image, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { icons, images } from '../../constants'

const WorkerLayout = () => {
  return (
   <>

   {/* Worker Routes */}
    <Stack>

      <Stack.Screen
        name='worker-dashboard'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='worker-profile'
        options={{
          headerShown: false
        }}
      />

    </Stack>
   </>
  )
}

export default WorkerLayout