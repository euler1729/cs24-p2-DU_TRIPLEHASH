import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { Link, Stack, router, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native';


import { icons, images } from '../../constants'
import { Colors } from '../../assets/configs.json'
import { logout } from '../../constants/utils';

const CustomDrawerComponent = (...props) => {
  const navigation = useNavigation();
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}
      contentContainerStyle={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <View
          className={`
            flex-row
            items-center
            mb-4
            bg-greenWhite
          `}
        >
          <Image
            source={images.brandLogoGifTransparent}
            className='w-40 h-40 self-start mt-1'
          />

        </View>


        <DrawerItem
          label={'Community'}
          labelStyle={{
            color: pathname === '/user-dashboard' ? Colors.greenLight : Colors.black,
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: -16
          }}
          onPress={() => {
            router.push('user-dashboard');
            // navigation.setOptions({
            //   title: 'Dashboard'
            // });
          }}
          icon={() => (
            <MaterialIcons name="handshake" size={24} color={Colors.greenLight} />
          )}
        />

        <DrawerItem
          label={'Nearby Facilities'}
          onPress={() =>
            router.push('user-nearby')
          }
          labelStyle={{
            color: pathname === '/user-nearby' ? Colors.greenLight : Colors.black,
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: -16
          }}
          icon={() => (
            <MaterialIcons name="near-me" size={24} color={Colors.greenLight} />
          )}
        />

        <DrawerItem
          label={'Task'}
          onPress={() =>
            router.push('user-task')
          }
          labelStyle={{
            color: pathname === '/user-task' ? Colors.greenLight : Colors.black,
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: -16
          }}
          icon={() => (
            <MaterialIcons name="task" size={24} color={Colors.greenLight} />
          )}
        />


        <DrawerItem
          label={'Reward'}
          onPress={() =>
            router.push('user-reward')
          }
          labelStyle={{
            color: pathname === '/user-reward' ? Colors.greenLight : Colors.black,
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: -16
          }}
          icon={() => (
            <MaterialIcons name="card-giftcard" size={24} color={Colors.greenLight} />
          )}
        />

        <DrawerItem
          label={'Report an Issue'}
          onPress={() =>
            router.push('user-issue')
          }
          labelStyle={{
            color: pathname === '/user-issue' ? Colors.greenLight : Colors.black,
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: -16
          }}
          icon={() => (
            <MaterialIcons name="report" size={24} color={Colors.greenLight} />
          )}
        />

        <DrawerItem
          label={'Volunteer'}
          onPress={() =>
            router.push('user-volunteer')
          }
          labelStyle={{
            color: pathname === '/user-volunteer' ? Colors.greenLight : Colors.black,
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: -16
          }}
          icon={() => (
            <MaterialIcons name="volunteer-activism" size={24} color={Colors.greenLight} />
          )}
        />

        
        <DrawerItem
          label={'Profile'}
          onPress={() =>
            router.push('user-profile')
          }
          labelStyle={{
            color: pathname === '/user-profile' ? Colors.greenLight : Colors.black,
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: -16
          }}
          icon={() => (
            <Image
              source={icons.profile}
              style={{
                width: 24,
                height: 24,
                tintColor: Colors.greenLight
              }}
            />
          )}
        />

      </View>
      <View>
        <DrawerItem
          label={'Logout'}
          labelStyle={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: -16
          }}
          onPress={logout}
          icon={() => (
            <MaterialIcons name="logout" size={24} color={Colors.greenLight} />
          )}
        />
      </View>
    </DrawerContentScrollView>
  )
}

const UserLayout = () => {
  return (
    <>
      <Drawer drawerContent={(props) => <CustomDrawerComponent {...props} />}>
      </Drawer>
      {/* <Tabs
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
      </Tabs> */}
    </>
  )
}

export default UserLayout