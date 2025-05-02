import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import { Info, ChevronRight, X } from 'lucide-react-native';
import { router } from 'expo-router';

const SpaceAvailability = () => {
  const [selectedBookingType, setSelectedBookingType] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('always');
  const [isWorkingWeekModalVisible, setIsWorkingWeekModalVisible] = useState(false);
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  
  // Working week selections
  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });
  const [workingStartTime, setWorkingStartTime] = useState('06:00');
  const [workingEndTime, setWorkingEndTime] = useState('19:00');

  // Custom availability selections
  const [customSelectedDays, setCustomSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');

  const toggleDay = (day, isCustom = false) => {
    if (isCustom) {
      setCustomSelectedDays(prev => ({
        ...prev,
        [day]: !prev[day]
      }));
    } else {
      setSelectedDays(prev => ({
        ...prev,
        [day]: !prev[day]
      }));
    }
  };

  const renderDaySelectionModal = (
    isVisible, 
    onClose, 
    selectedDays, 
    setSelectedDays, 
    startTime, 
    setStartTime, 
    endTime, 
    setEndTime,
    isCustom = false
  ) => (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-2xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">
              {isCustom ? 'Custom Availability' : 'Working Week Settings'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X className="text-gray-500" size={24} />
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-600 mb-4">Select Days</Text>
          <View className="flex-row flex-wrap mb-4">
            {Object.keys(selectedDays).map(day => (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day, isCustom)}
                className={`p-2 m-1 rounded-lg ${
                  selectedDays[day] 
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                }`}
              >
                <Text className={`text-xs ${
                  selectedDays[day] 
                    ? 'text-white' 
                    : 'text-black'
                }`}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-sm text-gray-600 mb-2">Time Range</Text>
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-xs text-gray-600 mb-1">Start Time</Text>
              <TouchableOpacity 
                className="bg-gray-100 p-2 rounded-lg"
                onPress={() => {/* Time picker logic */}}
              >
                <Text className="text-center text-sm">
                  {isCustom ? customStartTime || 'Select' : startTime}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-xs text-gray-600 mb-1">End Time</Text>
              <TouchableOpacity 
                className="bg-gray-100 p-2 rounded-lg"
                onPress={() => {/* Time picker logic */}}
              >
                <Text className="text-center text-sm">
                  {isCustom ? customEndTime || 'Select' : endTime}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-green-500 p-3 rounded-lg"
            onPress={onClose}
          >
            <Text className="text-white text-center text-sm font-bold">
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const BookingTypeSection = () => (
    <View className="bg-white p-4 rounded-lg mb-4">
      <Text className="text-lg font-bold mb-4">What type of bookings do you want?</Text>
      
      <TouchableOpacity 
        onPress={() => setSelectedBookingType('all')}
        className={`flex-row items-center p-3 border rounded-lg mb-3 ${
          selectedBookingType === 'all' ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}
      >
        <View className="flex-1">
          <Text className="text-base font-semibold">All bookings (maximum earnings)</Text>
          <Text className="text-xs text-gray-600">Accept both monthly and standard (hourly / daily) bookings.</Text>
        </View>
        <Info className="text-gray-500 ml-2" size={20} />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => setSelectedBookingType('standard')}
        className={`flex-row items-center p-3 border rounded-lg mb-3 ${
          selectedBookingType === 'standard' ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}
      >
        <View className="flex-1">
          <Text className="text-base font-semibold">Standard bookings - hourly / daily</Text>
          <Text className="text-xs text-gray-600">Drivers will be able to book your parking space for hours, days or weeks.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => setSelectedBookingType('monthly')}
        className={`flex-row items-center p-3 border rounded-lg ${
          selectedBookingType === 'monthly' ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}
      >
        <View className="flex-1">
          <Text className="text-base font-semibold">Monthly bookings</Text>
          <Text className="text-xs text-gray-600">Accepting monthly rolling bookings means that a single driver will use this space. You will receive a regular monthly income.</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const AvailabilitySection = () => (
    <View className="bg-white p-4 rounded-lg">
      <Text className="text-lg font-bold mb-4">Set the availability for your space</Text>
      <Text className="text-xs text-gray-600 mb-4">You can change this at any time</Text>

      <TouchableOpacity 
        onPress={() => setSelectedAvailability('always')}
        className={`flex-row items-center p-3 border rounded-lg mb-3 ${
          selectedAvailability === 'always' ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}
      >
        <View className="flex-1">
          <Text className="text-base font-semibold">Always available (Recommended)</Text>
          <Text className="text-xs text-gray-600">Monday - Sunday (24 hours)</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => {
          setSelectedAvailability('working');
          setIsWorkingWeekModalVisible(true);
        }}
        className={`flex-row items-center p-3 border rounded-lg mb-3 ${
          selectedAvailability === 'working' ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}
      >
        <View className="flex-1">
          <Text className="text-base font-semibold">Working week</Text>
          <Text className="text-xs text-gray-600">
            {selectedDays.monday && selectedDays.tuesday && selectedDays.wednesday && 
             selectedDays.thursday && selectedDays.friday 
              ? 'Monday - Friday' 
              : 'Custom days selected'} 
            {` (${workingStartTime} - ${workingEndTime})`}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => {
          setSelectedAvailability('custom');
          setIsCustomModalVisible(true);
        }}
        className={`flex-row items-center p-3 border rounded-lg ${
          selectedAvailability === 'custom' ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}
      >
        <View className="flex-1">
          <Text className="text-base font-semibold">Custom</Text>
          <Text className="text-xs text-gray-600">Personalised settings</Text>
        </View>
        <ChevronRight className="text-gray-500" size={20} />
      </TouchableOpacity>
      
      {renderDaySelectionModal(
        isWorkingWeekModalVisible, 
        () => setIsWorkingWeekModalVisible(false),
        selectedDays,
        setSelectedDays,
        workingStartTime,
        setWorkingStartTime,
        workingEndTime,
        setWorkingEndTime
      )}

      {renderDaySelectionModal(
        isCustomModalVisible, 
        () => setIsCustomModalVisible(false),
        customSelectedDays,
        setCustomSelectedDays,
        customStartTime,
        setCustomStartTime,
        customEndTime,
        setCustomEndTime,
        true
      )}
    </View>
  );

  const gotolocation = () => {
        console.log("Renting Process 3 Starts")
        router.push("/(root)/location");
    
      };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView 
        className="flex-1 p-4"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <BookingTypeSection />
        <AvailabilitySection />
        
        <View className="mt-auto pb-9">
          <TouchableOpacity 
            className="bg-green-500 p-3 rounded-lg"
            onPress={gotolocation}
            
          >
            <Text className="text-white text-center text-base font-bold">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SpaceAvailability;