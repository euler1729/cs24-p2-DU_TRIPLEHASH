import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { icons } from '../../constants';
import { Colors } from '../../assets/configs.json'

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className='items-center justify-center'>
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className={`w-6 h-6 ${focused ? 'tint-primary' : 'tint-secondary'}`}
            />
            <Text
                className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
                style={{ color: focused ? Colors.greenLight : Colors.greenAshLight }}
            >
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
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
                    name='home'
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
                        )
                    }}
                />
                <Tabs.Screen
                    name='navigate'
                    options={{
                        title: 'Navigate',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon icon={icons.search} color={color} name="Navigate" focused={focused} />
                        )
                    }}
                />
                <Tabs.Screen
                    name='profile'
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
                        )
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout