import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function TopNavBar() {
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = ['Home', 'Movies', 'TV Shows', 'Search'];

  return (
    <View className="flex-row justify-between items-center px-4 py-3 bg-neutral-900 border-b border-neutral-800">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full ${
            activeTab === tab ? 'bg-neutral-700' : ''
          }`}
        >
          <Text
            className={`${
              activeTab === tab ? 'text-white' : 'text-neutral-400'
            } font-semibold`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
} 