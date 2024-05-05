import { Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='login'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='register'
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style='auto' />
    </>
  )
}

export default AuthLayout