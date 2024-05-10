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
          label={'Dashboard'}
          labelStyle={{
            color: pathname === '/admin-dashboard' ? Colors.greenLight : Colors.black,
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: -16
          }}
          onPress={() => {
            router.push('admin-dashboard');
            // navigation.setOptions({
            //   title: 'Dashboard'
            // });
          }}
          icon={() => (
            <MaterialIcons name="dashboard" size={24} color={Colors.greenLight} />
          )}
        />
        <DrawerItem
          label={'Profile'}
          onPress={() =>
            router.push('admin-profile')
          }
          labelStyle={{
            color: pathname === '/admin-profile' ? Colors.greenLight : Colors.black,
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

const AdminLayout = () => {
  return (
    <>
      {/* <Drawer2.Navigator>
        <Drawer2.Screen name="Dashboard" component={Dashboard} />
        <Drawer2.Screen name="Profile" component={Profile} />
      </Drawer2.Navigator> */}

      <Drawer drawerContent={(props) => <CustomDrawerComponent {...props} />}>
      </Drawer>

      {/* Admin Routes */}
      {/* <Stack>
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
    </Stack> */}
    </>
  )
}

export default AdminLayout