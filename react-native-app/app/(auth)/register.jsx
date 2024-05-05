import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import { Link } from 'expo-router'

const Resigter = () => {
  const [form, setForm] = useState({
    user_name: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false)

  const submitForm = () => {
    console.log('Form submitted')
    setIsLoading(true)
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
            min-h-[85vh]
            w-full
            px-4
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
            Register to EcoSync
          </Text>

          <FormField
            title='Email/Username'
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
            title='Sign Up'
            handlePress={submitForm}
            containerStyle='bg-greenTea mt-4'
            textStyle='px-4 py-2'
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
              Already have an account?
              <Link
                href='/login'
                className={`
                  text-greenTea
                  font-psemibold
                `}
              >
                {' '}Login
              </Link>
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Resigter