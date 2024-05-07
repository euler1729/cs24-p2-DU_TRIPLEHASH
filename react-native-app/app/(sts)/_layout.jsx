import { Image, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { icons, images } from '../../constants'

const STSLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='sts-dashboard'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='sts-profile'
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </>
  )
}

export default STSLayout