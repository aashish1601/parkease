import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const WhichChat = () => {
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();

  const handleSelection = (type) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/${selectedType}Chat`); // Navigate to respective chat screen using expo-router
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 24, flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 32 }}>
          What are You?
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
          <TouchableOpacity
            style={{ 
              padding: 20, 
              borderRadius: 12, 
              backgroundColor: selectedType === 'driver' ? '#3b82f6' : '#f3f4f6', 
              width: 160, 
              alignItems: 'center' 
            }}
            onPress={() => handleSelection('driver')}
          >
            <View style={{
              width: 80, 
              height: 80, 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: 12, 
              borderRadius: 40, 
              backgroundColor: '#dbeafe' 
            }}>
              <Text style={{ fontSize: 36 }}>🚗</Text>
            </View>
            <Text style={{ fontWeight: 'bold', color: selectedType === 'driver' ? 'white' : '#1f2937', fontSize: 28 }}>
              Driver
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ 
              padding: 20, 
              borderRadius: 12, 
              backgroundColor: selectedType === 'owner' ? '#3b82f6' : '#f3f4f6', 
              width: 160, 
              alignItems: 'center' 
            }}
            onPress={() => handleSelection('owner')}
          >
            <View style={{ 
              width: 80, 
              height: 80, 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: 12, 
              borderRadius: 40, 
              backgroundColor: '#dbeafe' 
            }}>
              <Text style={{ fontSize: 36 }}>🏠</Text>
            </View>
            <Text style={{ fontWeight: 'bold', color: selectedType === 'owner' ? 'white' : '#1f2937', fontSize: 28 }}>
              Space Owner
            </Text>
          </TouchableOpacity>
        </View>

        {selectedType && (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#2563eb', 
                padding: 16, 
                borderRadius: 28, 
                width: 256, 
                alignItems: 'center' 
              }}
              onPress={handleContinue}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WhichChat;
