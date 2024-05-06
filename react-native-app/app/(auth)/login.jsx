import { View, Text, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Redirect, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { images } from '../../constants'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import {api, saveKey, getValueFor} from '../../constants/utils'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Login = () => {

  const [form, setForm] = useState({
    user_name: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false)

  const submitForm = async() => {
    console.log(form)
    setIsLoading(true)
    try {
      const response = await api.post('/auth/login', form)
      if(response){
        if(response.status === 200){
          await saveKey('access_token', response.data.access_token)
          await saveKey('user', JSON.stringify(response.data.user))
          router.push('/home')
        }else{
          alert('Invalid credentials')
        }
        setIsLoading(false)
      }
    } catch (error) {
      alert('Invalid credentials')
      console.log(error)
      setIsLoading(false)
    }
  }


  return (
    <SafeAreaView
      className={`
      bg-greenWhite
        h-full
      `}
    >
      <ScrollView>
        <View
          className={`
            justify-center
            min-h-[80vh]
            w-full
            px-6
            my-0
          `}
        >
          <Image
            source={images.brandLogoGifTransparent}
            resizeMode='contain'
            className='w-40 h-40 mx-auto'
          />
          <Text
            className={`
              text-center
              text-greenTea
              text-2xl
              font-psemibold
              mt-1
            `}
          >
            Login to EcoSync
          </Text>
          <View
            className={`
              border-2
              p-4
              rounded-2xl
              border-greenTea
            `}
          >
            <FormField
              title='Email or Username'
              value={form.user_name}
              handleChangeText={(value) => setForm({ ...form, user_name: value })}
              placeholder='Enter your email or username'
              otherStyles='mt-6'
              keyboardType='email-address'
            />
            <FormField
              title='Password'
              value={form.password}
              handleChangeText={(value) => setForm({ ...form, password: value })}
              placeholder='Enter at least 8 characters'
              otherStyles='mt-6'
            />
            <CustomButton
              title='Sign In'
              handlePress={submitForm}
              containerStyle='bg-greenTea mt-4'
              textStyle=''
              isLoading={isLoading}
            />

            <View>
              <Text
                className={`
                  text-center
                  text-greenAsh
                  font-pmedium
                  mt-4
                `}
              >
                Don't have an account?
                <Link
                  href='/register'
                  className={`
                    text-greenTea
                    font-psemibold
                    underline
                  `}
                >
                  {' '}Sign Up
                </Link>
              </Text>
              <Text
                className={`
                  text-center
                  text-greenAsh
                  font-pmedium
                  mt-0
                `}
              >
                Forgot your password?
                <Link
                  href='/reset-password'
                  className={`
                    text-greenTea
                    font-psemibold
                    underline
                  `}
                >
                  {' '}Reset Password
                </Link>
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login