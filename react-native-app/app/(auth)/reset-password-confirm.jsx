import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'


import { images } from '../../constants'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import { api } from '../../constants/utils'


const ResetPasswordConfirm = () => {
  const [form, setForm] = useState({
    user_name: '',
    new_password: '',
    confirm_password: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    if (!form.user_name || !form.new_password || !form.confirm_password || !form.otp) {
      alert('All fields are required')
      return false
    }
    if (form.new_password !== form.confirm_password) {
      alert('Passwords do not match')
      return false
    }
    return true
  }
  

  const submitForm = () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true)
      api.post('/auth/reset-password/confirm', form)
        .then(response => {
          if (response.status === 200) {
            alert('Password reset successful')
            router.replace('/login')
          } else {
            alert('OTP may be invalid or expired')
          }
          setIsLoading(false)
        })
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
            Reset Password
          </Text>

          <View
            className={`
              border-2
              p-4
              border-greenAsh
              rounded-2xl
              mt-4
            `}
          >
            <FormField
              title='Email or Username'
              value={form.user_name}
              handleChangeText={(value) => setForm({ ...form, user_name: value })}
              placeholder='Enter your email or username'
              keyboardType='email-address'
            />
            <FormField
              title='Password'
              value={form.new_password}
              handleChangeText={(value) => setForm({ ...form, new_password: value })}
              placeholder='Enter at least 8 characters'
              otherStyles='mt-3'
            />
            <FormField
              title='Confirm Password'
              value={form.confirm_password}
              handleChangeText={(value) => setForm({ ...form, confirm_password: value })}
              placeholder='Re-enter your password'
              otherStyles='mt-3'
            />
            <FormField
              title='OTP'
              value={form.otp}
              handleChangeText={(value) => setForm({ ...form, otp: value })}
              placeholder='Enter the OTP sent to your email'
              otherStyles='mt-3'
              keyboardType='numeric'
            />
            <CustomButton
              title='Reset Password'
              handlePress={submitForm}
              containerStyle='bg-greenTea mt-4'
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
                Already have an account?
                <Link
                  href='/login'
                  className={`
                    text-greenTea
                    font-psemibold
                    underline
                  `}
                >
                  {' '}Sign In
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ResetPasswordConfirm