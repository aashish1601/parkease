import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Animated, Easing } from 'react-native';
import { ArrowLeft, ChevronRight, X, CheckCircle, Car, Clock, CreditCard } from 'lucide-react-native';
import { router } from 'expo-router';

const SpacePrice = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [customPrice, setCustomPrice] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  
  const areaRecommendedPrice = '₹20';

  const handleContinue = () => {

    // Show success modal
    setSuccessModalVisible(true);
    
    // Start animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic)
    }).start();
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setSuccessModalVisible(false);
      // Reset animation for next time
      animation.setValue(0);
    }, 3000);
    console.log("Renting Process 2 Starts")
    router.push("/(root)/(tabs)/rent");
  };
  
  // Derived animation values
  const scaleAnim = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 1]
  });
  
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Progress bar */}
      <View className="h-1 w-full bg-gray-200">
        <View className="h-1 w-3/5 bg-green-500" />
      </View>
      
      {/* Main content */}
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">What is your preferred parking space price?</Text>
        
        {/* Option 1: Area recommended */}
        <TouchableOpacity 
          className={`p-4 border rounded-lg mb-4 ${selectedOption === 'recommended' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
          onPress={() => setSelectedOption('recommended')}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-semibold">According to your area (Recommended)</Text>
              <Text className="text-gray-600 mt-1">Based on similar spaces in your neighborhood</Text>
              <Text className="text-xl font-bold mt-2 text-green-600">{areaRecommendedPrice} per hour</Text>
            </View>
            <View className="h-6 w-6 rounded-full border-2 items-center justify-center">
              {selectedOption === 'recommended' && (
                <View className="h-3 w-3 rounded-full bg-green-500" />
              )}
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Option 2: Custom price */}
        <TouchableOpacity 
          className={`p-4 border rounded-lg ${selectedOption === 'custom' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
          onPress={() => setSelectedOption('custom')}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-semibold">Customize price</Text>
              <Text className="text-gray-600 mt-1">Set your own daily rate</Text>
              
              {selectedOption === 'custom' && (
                <View className="mt-3 flex-row items-center">
                  <Text className="text-xl font-bold">₹</Text>
                  <TextInput
                    className="flex-1 text-xl font-bold ml-1 p-2 border-b border-gray-300"
                    placeholder="0.00"
                    value={customPrice}
                    onChangeText={setCustomPrice}
                    keyboardType="decimal-pad"
                    autoFocus
                  />
                  <Text className="text-gray-600 ml-2">per hour</Text>
                </View>
              )}
            </View>
            <View className="h-6 w-6 rounded-full border-2 items-center justify-center">
              {selectedOption === 'custom' && (
                <View className="h-3 w-3 rounded-full bg-green-500" />
              )}
            </View>
          </View>
        </TouchableOpacity>
        
        {selectedOption === 'custom' && (
          <View className="mt-4 p-4 bg-blue-50 rounded-lg">
            <Text className="text-blue-800">
              Setting your price too high may result in fewer bookings. We recommend staying close to the suggested price for your area.
            </Text>
          </View>
        )}
      </View>
      
      {/* Price comparison info */}
      {selectedOption === 'custom' && customPrice && parseFloat(customPrice) > parseFloat(areaRecommendedPrice.substring(1)) && (
        <View className="mx-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <Text className="text-yellow-800">
            Your price is {((parseFloat(customPrice) / parseFloat(areaRecommendedPrice.substring(1))) * 100 - 100).toFixed(0)}% higher than similar spaces in your area. This might reduce your booking rate.
          </Text>
        </View>
      )}
      
      {/* Continue button */}
      <View className="p-4 mt-auto">
        <TouchableOpacity 
          className={`py-4 rounded-lg items-center ${selectedOption ? 'bg-green-500' : 'bg-gray-300'}`}
          disabled={!selectedOption || (selectedOption === 'custom' && !customPrice)}
          onPress={handleContinue}
        >
          <Text className="text-white text-lg font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
      
      {/* Success Modal */}
      <Modal
        transparent
        visible={successModalVisible}
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-6">
          <Animated.View 
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            style={{
              transform: [{ scale: scaleAnim }]
            }}
          >
            <View className="items-center mb-4">
              <CheckCircle size={60} color="#22c55e" />
            </View>
            
            <Text className="text-2xl font-bold text-center mb-4">Your Space is Listed!</Text>
            <Text className="text-gray-700 text-center mb-6">
              Congratulations! Your parking space is now live and ready to receive bookings. You'll be notified when someone books your space.
            </Text>
            
            <View className="border-t border-gray-200 pt-4 mb-4">
              <View className="flex-row items-center mb-3">
                <Car size={20} color="#4b5563" />
                <Text className="text-gray-700 ml-2">Your parking space is now visible to drivers</Text>
              </View>
              <View className="flex-row items-center mb-3">
                <Clock size={20} color="#4b5563" />
                <Text className="text-gray-700 ml-2">
                  Price: {selectedOption === 'recommended' ? areaRecommendedPrice : `₹${customPrice}`} per hour
                </Text>
              </View>
              <View className="flex-row items-center">
                <CreditCard size={20} color="#4b5563" />
                <Text className="text-gray-700 ml-2">Earnings will be deposited to your account</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              className="bg-green-500 py-3 rounded-lg items-center"
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text className="text-white font-semibold">View My Listings</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SpacePrice;