import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Resistance Bands Set",
      price: 29.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJlc2lzdGFuY2UlMjBiYW5kc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "Protein Powder",
      price: 49.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1594489573454-3a9e7b2c4ed3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvdGVpbiUyMHBvd2RlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      name: "Water Bottle",
      price: 19.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2F0ZXIlMjBib3R0bGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
  ]);

  const shippingOptions = [
    {
      id: 1,
      name: "Standard Shipping",
      price: 4.99,
      days: "3-5 business days",
    },
    { id: 2, name: "Express Shipping", price: 9.99, days: "2-3 business days" },
    {
      id: 3,
      name: "Next Day Delivery",
      price: 19.99,
      days: "Next business day",
    },
  ];

  const [selectedShipping, setSelectedShipping] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "fit20") {
      setDiscount(20);
    } else if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(10);
    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping =
      shippingOptions.find((opt) => opt.id === selectedShipping)?.price || 0;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + shipping - discountAmount;
  };

  const selectedShippingOption = shippingOptions.find(
    (opt) => opt.id === selectedShipping
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-5 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Shopping Cart
          </Text>
          <Text className="text-gray-600 text-center mt-1">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </Text>
        </View>

        {/* Cart Items */}
        <View className="bg-white mt-4 mx-4 rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              Cart Items
            </Text>
          </View>

          {cartItems.map((item) => (
            <View key={item.id} className="p-4 border-b border-gray-100">
              <View className="flex-row">
                <Image
                  source={{ uri: item.image }}
                  className="w-20 h-20 rounded-lg"
                />
                <View className="flex-1 ml-4 justify-between">
                  <View>
                    <Text className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </Text>
                    <Text className="text-green-600 font-semibold">
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>

                  {/* Quantity Controls */}
                  <View className="flex-row items-center mt-2">
                    <Pressable
                      onPress={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                    >
                      <Ionicons name="remove" size={16} color="#374151" />
                    </Pressable>

                    <Text className="mx-3 text-gray-800 font-semibold min-w-[20px] text-center">
                      {item.quantity}
                    </Text>

                    <Pressable
                      onPress={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                    >
                      <Ionicons name="add" size={16} color="#374151" />
                    </Pressable>

                    <Text className="ml-auto text-gray-600 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Remove Button */}
              <Pressable
                onPress={() => removeItem(item.id)}
                className="flex-row items-center mt-3"
              >
                <Ionicons name="trash-outline" size={18} color="#dc2626" />
                <Text className="text-red-600 ml-2">Remove</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Shipping Options */}
        <View className="bg-white mt-6 mx-4 rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              Shipping Options
            </Text>
          </View>

          {shippingOptions.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => setSelectedShipping(option.id)}
              className={`p-4 border-b border-gray-100 ${
                selectedShipping === option.id ? "bg-blue-50" : ""
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedShipping === option.id
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  } items-center justify-center`}
                >
                  {selectedShipping === option.id && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-gray-900 font-medium">
                    {option.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">{option.days}</Text>
                </View>

                <Text className="text-gray-800 font-semibold">
                  ${option.price.toFixed(2)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Promo Code */}
        <View className="bg-white mt-6 mx-4 rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              Promo Code
            </Text>
          </View>

          <View className="p-4">
            <View className="flex-row">
              <TextInput
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={setPromoCode}
                className="flex-1 border border-gray-300 rounded-l-lg p-3 text-gray-800"
              />
              <Pressable
                onPress={applyPromoCode}
                className="bg-blue-500 justify-center items-center px-4 rounded-r-lg"
              >
                <Text className="text-white font-semibold">Apply</Text>
              </Pressable>
            </View>

            {discount > 0 && (
              <Text className="text-green-600 mt-2">
                {discount}% discount applied!
              </Text>
            )}
          </View>
        </View>

        {/* Order Summary */}
        <View className="bg-white mt-6 mx-4 rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-8">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              Order Summary
            </Text>
          </View>

          <View className="p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-800">
                ${calculateSubtotal().toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="text-gray-800">
                ${selectedShippingOption?.price.toFixed(2)}
              </Text>
            </View>

            {discount > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-green-600">Discount ({discount}%)</Text>
                <Text className="text-green-600">
                  -${((calculateSubtotal() * discount) / 100).toFixed(2)}
                </Text>
              </View>
            )}

            <View className="border-t border-gray-200 pt-3 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-lg font-semibold text-gray-900">
                  Total
                </Text>
                <Text className="text-lg font-semibold text-gray-900">
                  ${calculateTotal().toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Checkout Button */}
            <Pressable className="bg-blue-500 py-4 rounded-lg mt-4 items-center">
              <Text className="text-white font-semibold text-lg">
                Proceed to Checkout
              </Text>
            </Pressable>

            <Pressable className="border border-gray-300 py-3 rounded-lg mt-3 items-center">
              <Text className="text-gray-800 font-semibold">
                Continue Shopping
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;
