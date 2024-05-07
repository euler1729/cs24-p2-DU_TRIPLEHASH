import { Image, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { icons, images } from '../../constants'

const AdminLayout = () => {
  return (
   <>

   {/* Admin Routes */}
    <Stack>

      <Stack.Screen
        name='admin-dashboard'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='admin-profile'
        options={{
          headerShown: false
        }}
      />

    </Stack>
   </>
  )
}

export default AdminLayout