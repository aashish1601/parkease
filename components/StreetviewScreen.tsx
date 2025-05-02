import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { ChevronLeft, MapPin, X, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

const StreetView = () => {
  const [location, setLocation] = useState('location');

  const addphotos = () => {
        console.log("Renting Process 2 Starts")
        router.push("/(root)/addphotos");
    
      };



  return (
    <SafeAreaView className="flex-1 bg-white">
      

      {/* Main Content */}
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Add the streetview of your space
        </Text>

        {/* Location Input */}
        <View className="mb-4">
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
            <MapPin color="#4A5568" size={20} />
            <TextInput
              value={location}
              onChangeText={setLocation}
              className="flex-1 ml-2 text-gray-800"
              placeholder="Enter location"
            />
            {location && (
              <TouchableOpacity onPress={() => setLocation('')}>
                <X color="#718096" size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Street View Image */}
        <View className="rounded-lg overflow-hidden mb-4 relative">
          <Image
            source={{
              uri: 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=51.501476,-0.141714&key=AIzaSyD0Y0rPaqRKPo3lcsNo9ALVP84MDisdXLE'
            }}
            className="w-full h-64"
            resizeMode="cover"
          />
          <TouchableOpacity className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md">
            <Plus color="#2D3748" size={24} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-4">
          <TouchableOpacity className="flex-1"
          onPress={addphotos}>
            <Text className="text-center text-green-600 font-semibold py-3 border border-green-600 rounded-lg">
              Skip for now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-green-600 rounded-lg"
          onPress={addphotos}>
            <Text className="text-center text-white font-semibold py-3">
              Confirm streetview
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StreetView;