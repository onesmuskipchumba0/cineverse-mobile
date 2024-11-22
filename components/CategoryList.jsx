import { ScrollView, TouchableOpacity, Text } from 'react-native';

export default function CategoryList({ categories, activeCategory, setActiveCategory }) {
  return (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-b border-neutral-800"
      contentContainerStyle={{ paddingHorizontal: 15 }}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => setActiveCategory(category.title)}
          className={`mr-3 px-6 py-4 ${
            activeCategory === category.title 
              ? 'border-b-2 border-white' 
              : 'border-b-2 border-transparent'
          }`}
        >
          <Text className={`${
            activeCategory === category.title 
              ? 'text-white font-bold' 
              : 'text-neutral-400'
          } text-base`}>
            {category.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
} 