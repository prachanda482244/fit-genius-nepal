import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get("window");

// Product data
const productCategories = [
  {
    id: 1,
    name: "All Products",
    icon: "grid",
  },
  {
    id: 2,
    name: "Equipment",
    icon: "barbell",
  },
  {
    id: 3,
    name: "Supplements",
    icon: "nutrition",
  },
  {
    id: 4,
    name: "Clothing",
    icon: "shirt",
  },
  {
    id: 5,
    name: "Accessories",
    icon: "fitness",
  },
];

const productsData = {
  equipment: [
    {
      id: 1,
      name: "Resistance Bands Set",
      price: 29.99,
      category: "Equipment",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Set of 3 with different resistance levels",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Adjustable Dumbbells",
      price: 129.99,
      category: "Equipment",
      image:
        "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "5-25kg adjustable set",
      rating: 4.7,
      reviews: 89,
    },
    {
      id: 3,
      name: "Yoga Mat Premium",
      price: 39.99,
      category: "Equipment",
      image:
        "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Non-slip eco-friendly mat",
      rating: 4.9,
      reviews: 156,
    },
    {
      id: 4,
      name: "Jump Rope Professional",
      price: 19.99,
      category: "Equipment",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Weighted speed rope",
      rating: 4.6,
      reviews: 78,
    },
  ],
  supplements: [
    {
      id: 5,
      name: "Whey Protein",
      price: 49.99,
      category: "Supplements",
      image:
        "https://images.unsplash.com/photo-1594489573454-3a9e7b2c4ed3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "2kg vanilla flavor",
      rating: 4.8,
      reviews: 203,
    },
    {
      id: 6,
      name: "Creatine Monohydrate",
      price: 29.99,
      category: "Supplements",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "300g pure creatine",
      rating: 4.7,
      reviews: 145,
    },
    {
      id: 7,
      name: "BCAA Powder",
      price: 34.99,
      category: "Supplements",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Fruit punch flavor",
      rating: 4.6,
      reviews: 98,
    },
    {
      id: 8,
      name: "Pre-Workout",
      price: 39.99,
      category: "Supplements",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Energy and focus booster",
      rating: 4.5,
      reviews: 112,
    },
  ],
  clothing: [
    {
      id: 9,
      name: "Training Tank Top",
      price: 24.99,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Breathable quick-dry fabric",
      rating: 4.7,
      reviews: 167,
    },
    {
      id: 10,
      name: "Yoga Pants",
      price: 34.99,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "High-waist compression",
      rating: 4.8,
      reviews: 189,
    },
    {
      id: 11,
      name: "Gym Shorts",
      price: 22.99,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Flexible and comfortable",
      rating: 4.6,
      reviews: 134,
    },
    {
      id: 12,
      name: "Sports Bra",
      price: 19.99,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "High support level",
      rating: 4.9,
      reviews: 201,
    },
  ],
  accessories: [
    {
      id: 13,
      name: "Water Bottle",
      price: 19.99,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "1L, BPA free",
      rating: 4.8,
      reviews: 156,
    },
    {
      id: 14,
      name: "Gym Bag",
      price: 39.99,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Water-resistant with compartments",
      rating: 4.7,
      reviews: 89,
    },
    {
      id: 15,
      name: "Weight Lifting Gloves",
      price: 15.99,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Padded palm protection",
      rating: 4.5,
      reviews: 112,
    },
    {
      id: 16,
      name: "Fitness Tracker",
      price: 79.99,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      description: "Heart rate monitor",
      rating: 4.6,
      reviews: 145,
    },
  ],
};

const allProducts = [
  ...productsData.equipment,
  ...productsData.supplements,
  ...productsData.clothing,
  ...productsData.accessories,
];

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [cart, setCart] = useState([]);

  const addToCart = (product: any) => {
    setCart((prev) => [...prev, product]);
    // Show success feedback
    alert(`${product.name} added to cart!`);
  };

  const getProductsByCategory = () => {
    if (selectedCategory === "All Products") return allProducts;
    if (selectedCategory === "Equipment") return productsData.equipment;
    if (selectedCategory === "Supplements") return productsData.supplements;
    if (selectedCategory === "Clothing") return productsData.clothing;
    if (selectedCategory === "Accessories") return productsData.accessories;
    return allProducts;
  };

  const renderProductItem = ({ item }) => (
    <View
      className="bg-white rounded-2xl shadow-lg overflow-hidden mx-2 mb-4"
      style={{ width: width * 0.45 }}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-sm text-gray-500 mb-1">{item.category}</Text>
        <Text
          className="text-lg font-bold text-gray-900 mb-1"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
          {item.description}
        </Text>

        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={14} color="#f59e0b" />
          <Text className="text-sm text-gray-600 ml-1">
            {item.rating} ({item.reviews})
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-green-600">
            ${item.price}
          </Text>
          <Pressable
            onPress={() => addToCart(item)}
            className="bg-blue-500 p-2 rounded-full"
          >
            <Ionicons name="cart" size={16} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderCategoryItem = ({ item }) => (
    <Pressable
      onPress={() => setSelectedCategory(item.name)}
      className={`px-4 py-3 rounded-full mx-1 flex-row items-center ${
        selectedCategory === item.name ? "bg-blue-500" : "bg-gray-100"
      }`}
    >
      <Ionicons
        name={item.icon}
        size={16}
        color={selectedCategory === item.name ? "white" : "#6b7280"}
      />
      <Text
        className={`ml-2 font-medium ${
          selectedCategory === item.name ? "text-white" : "text-gray-700"
        }`}
      >
        {item.name}
      </Text>
    </Pressable>
  );
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">
            Fitness Store
          </Text>
          <Pressable className="relative" onPress={() => router.push("cart")}>
            <Ionicons name="cart" size={24} color="#374151" />
            {cart.length > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {cart.length}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
        <Text className="text-gray-600 mt-1">
          Premium fitness equipment & supplements
        </Text>
      </View>

      {/* Categories Scroll */}
      <View className="bg-white py-3 border-b border-gray-200">
        <FlatList
          data={productCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4"
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={getProductsByCategory()}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerClassName="p-4"
        columnWrapperClassName="justify-between"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text className="text-xl font-bold text-gray-900 mb-4">
            {selectedCategory} ({getProductsByCategory().length} items)
          </Text>
        }
      />

      {/* Quick Add Floating Button */}
      <Pressable
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-xl"
        onPress={() => alert("Quick add feature coming soon!")}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
    </SafeAreaView>
  );
};

export default Product;
