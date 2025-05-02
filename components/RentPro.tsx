import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MapPin, Home, Car } from 'lucide-react-native';
import { router } from 'expo-router';

const RentProcess = () => {
  const [selectedSpace, setSelectedSpace] = useState(null);
  const spaceTypes = [
    { 
      id: 'driveway', 
      name: 'Driveway', 
      icon: <Car color="#4A90E2" size={24} />,
      description: 'Perfect for parking vehicles or small equipment' 
    },
    { 
      id: 'garage', 
      name: 'Garage', 
      icon: <Home color="#4A90E2" size={24} />,
      description: 'Secure, enclosed space for storage' 
    },
    { 
      id: 'parking', 
      name: 'Parking Spot', 
      icon: <MapPin color="#4A90E2" size={24} />,
      description: 'Designated parking area' 
    }
  ];
  const gotospaceavail = () => {
      console.log("Renting Process 2 Starts")
      router.push("/(root)/space");
  
    };

  return (
    <ScrollView>
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-gray-800 mb-4">
          Tell Us About Your Space
        </Text>
        <Text className="text-gray-600 mb-6">
          Select the type of space you're looking to rent out
        </Text>

        <View className="space-y-4">
          {spaceTypes.map((space) => (
            <TouchableOpacity 
              key={space.id}
              onPress={() => setSelectedSpace(space.id)}
              className={`
                flex-row items-center p-4 rounded-xl border
                ${selectedSpace === space.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white'}
              `}
            >
              <View className="mr-4">
                {space.icon}
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {space.name}
                </Text>
                <Text className="text-gray-500">
                  {space.description}
                </Text>
              </View>
              {selectedSpace === space.id && (
                <View className="w-6 h-6 rounded-full bg-general-400 items-center justify-center">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedSpace && (
          <View className="mt-6">
            <TextInput
              placeholder="Additional details about your space"
              multiline
              className="border border-gray-200 rounded-xl p-4 h-24 text-gray-700"
            />
          </View>
        )}

        <TouchableOpacity  onPress={gotospaceavail}
          disabled={!selectedSpace}
          className={`
            mt-6 p-4 rounded-xl items-center
            ${selectedSpace 
              ? 'bg-general-400' 
              : 'bg-gray-300'}
          `
        }
        >
          <Text className={`
            text-lg font-bold
            ${selectedSpace ? 'text-white' : 'text-gray-500'}
          `}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ScrollView>
  );
};

export default RentProcess;