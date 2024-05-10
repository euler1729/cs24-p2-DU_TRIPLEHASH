import React from 'react';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';
import { Colors } from '../../assets/configs.json'
import TabIcon from '../components/TabIcon';


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
                    name='admin-dashboard'
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
                        )
                    }}
                />
                <Tabs.Screen
                    name='admin-profile'
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