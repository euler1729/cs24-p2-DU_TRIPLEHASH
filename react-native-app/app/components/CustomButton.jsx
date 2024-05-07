import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({
    title = 'Button',
    handlePress,
    containerStyle = 'mt-4',
    textStyle = 'px-4 py-2',
    isLoading }) => {

    return (
        <TouchableOpacity
            className={`
                rounded-xl
                min-h-[40px] 
                justify-center
                items-center
                ${containerStyle}
                ${isLoading ? 'opacity-50' : ''}
            `}
            disabled={isLoading}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <Text
                className={`
                    justify-center
                    text-white 
                    font-psemibold 
                    text-sm
                    ${textStyle}
                `}
            >
                {title}
            </Text>

        </TouchableOpacity>
    )
}

export default CustomButton