import { Image, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { Entypo } from '@expo/vector-icons';
import { icons, images } from '../../constants'
import { Colors } from '../../assets/configs.json'
import TabsIcon from '../components/TabIcon';



const UserLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.greenLight,
          tabBarInactiveTintColor: Colors.greenAshLight,
          tabBarStyle: {
            backgroundColor: Colors.greenWhite,
            borderTopWidth: 1,
            height: 60,
          }
        }}
      >
        <Tabs.Screen
          name='user-dashboard'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabsIcon icon={icons.home} color={color} name="Home" focused={focused} />
            )
          }}
        />
        <Tabs.Screen
          name='user-map'
          options={{
            title: 'Map',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabsIcon icon={icons.map} color={color} name="Map" focused={focused} />
            )
          }}
        />
        <Tabs.Screen
          name='user-profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabsIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default UserLayout