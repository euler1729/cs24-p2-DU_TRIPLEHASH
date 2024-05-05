import { Image, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { icons, images } from '../../constants'

const AuthLayout = () => {
  return (
    <>
      <View
        className={`
          absolute
          top-8
          left-6
          z-10
          w-full
        `}
      >
        <Link href='/'>
          <Image
            source={icons.leftArrow}
            resizeMode='contain'
            className='w-6 h-6'
          />
          {' '}
        </Link>
      </View>
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
        <Stack.Screen
          name='reset-password'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='reset-password-confirm'
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