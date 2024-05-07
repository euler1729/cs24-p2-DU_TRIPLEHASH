import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Redirect, router } from 'expo-router';

// Constants UI Elements
import { images } from '../constants'
import { Name, Colors } from '../assets/configs.json';

// Components
import CustomButton from './components/CustomButton';
import { useEffect, useState } from 'react';
import { getValueFor, checkUser } from '../constants/utils';


export default function App() {

  const [user, setUser] = useState(null);
  const [role, setRole] = useState({
    1: 'admin',
    2: 'sts',
    3: 'landfill',
    4: 'unassigned',
    5: 'user',
    6: 'worker'
  });
  useEffect(() => {
    if (!user) checkUser();
  }, [user]);

  // // Check if user is logged in
  // const checkUser = async () => {
  //   const access_token = await getValueFor('access_token');
  //   if (access_token) {
  //     const userInfo = await getValueFor('user');
  //     if(userInfo) {
  //       const user = JSON.parse(userInfo);
  //       setUser(userInfo);
  //       await changeRoute(user.role_id);
  //     }
  //   }
  // }

  // // Change route based on role_id
  // async function changeRoute(role_id) {
  //   console.log('role_id, role: ', role_id, role[role_id]); 
  //   switch (role[role_id]) {
  //     case 'admin':
  //       router.replace('/admin-dashboard');
  //       break;
  //     case 'sts':
  //       router.replace('/sts-dashboard');
  //       break;
  //     case 'landfill':
  //       router.replace('/landfill-dashboard');
  //       break;
  //     case 'unassigned':
  //       router.replace('/');
  //       break;
  //     case 'user':
  //       router.replace('/user-dashboard');
  //       break;
  //     case 'worker':
  //       router.replace('/worker-dashboard');
  //       break;
  //     default:
  //       break;
  //   }
  // }


  return (
    <SafeAreaView className="bg-greenWhite h-full">
      <ScrollView
        contentContainerStyle={{ height: '100%' }}
      >
        <View
          className={`
            items-center 
            justify-center 
            h-full 
            w-full 
          `}
        >
          <Image
            source={images.brandLogoGifTransparent}
            className='w-[130px] h-[130px] bg-transparent'
            resizeMode='contain'
          />
          <Text className='font-psemibold text-sm text-greenTea mt-1'>
            EcoSync: Revolutionizing Waste Management
          </Text>
          <View
            className={`
              w-full 
              px-4 
              py-8 
              rounded-3xl 
              flex-row
              justify-center
              items-center
            `}
          >
            <CustomButton
              title='Learn More'
              handlePress={() => { router.replace('/home') }}
              containerStyle='mt-4 mr-4 w-28 bg-blue-900'
              textStyle='px-4 py-2'
              isLoading={false}
            />
            <CustomButton
              title='SignIn'
              handlePress={() => { router.push('/login') }}
              containerStyle='mt-4 bg-red-700 w-28'
              textStyle='px-4 py-2'
              isLoading={false}
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar
        hidden={false}
        style="auto"
        backgroundColor={'transparent'}
        translucent={true}
      />
    </SafeAreaView>
  );
}