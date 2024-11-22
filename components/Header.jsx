import { View, Text } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View className="flex-row justify-between items-center p-5">
      <Text className="text-2xl font-bold">MovieBox</Text>
    </View>
  )
}

export default Header