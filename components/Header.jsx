import { View, Text } from 'react-native'
import React from 'react'
import { FilmIcon } from 'react-native-heroicons/solid'

const Header = () => {
  return (
    <View className="flex-row justify-between items-center p-5">
      <View className="flex-row items-center mt-5 space-x-2">
        <FilmIcon size={28} color="#3b82f6" />
        <Text className="text-2xl font-bold text-white">Cineverse</Text>
      </View>
    </View>
  )
}

export default Header