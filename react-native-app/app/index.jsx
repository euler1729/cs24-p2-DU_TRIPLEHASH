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

  useEffect(() => {
    if (!user) setUser(checkUser());
  }, [user]);


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