import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { router } from "expo-router";

// Interfaces for type safety
interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
}

interface VehicleDetails {
  name?: string;
}

interface ParkingDetails {
  location: string;
  parkingFee: number;
  transactionFee: number;
  insuranceFee: number;
}

interface TimeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  title: string;
  selectedTime: string;
}

const ParkingBookingScreen: React.FC = () => {
  const [isInsuranceEnabled, setIsInsuranceEnabled] = useState<boolean>(false);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    name: "Aashish Mhaske",
    email: "mhaskeasaish16@gmail.com",
    phone: "7900000000",
  });
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
  
  // Time selection states
  const [isStartTimeModalVisible, setIsStartTimeModalVisible] = useState<boolean>(false);
  const [isEndTimeModalVisible, setIsEndTimeModalVisible] = useState<boolean>(false);
  const [selectedStartTime, setSelectedStartTime] = useState<string>("Today at 1:15 am");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("Today at 3:15 am");

  // Generate time slots
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const period = hour < 12 ? 'am' : 'pm';
        const displayHour = hour % 12 || 12;
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`Today at ${displayHour}:${formattedMinute} ${period}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const parkingDetails: ParkingDetails = {
    location: "Parking on Bartle Road, W11",
    parkingFee: 31.45,
    transactionFee: 1.49,
    insuranceFee: 0.58,
  };

  const calculateTotalPrice = (): string => {
    return (
      parkingDetails.parkingFee +
      parkingDetails.transactionFee +
      (isInsuranceEnabled ? parkingDetails.insuranceFee : 0)
    ).toFixed(2);
  };

  const calculateDuration = (start: string, end: string): string => {
    // This is a simplified duration calculation
    // In a real app, you'd want a more precise method
    return "2h";
  };

  const TimeSelectionModal: React.FC<TimeSelectionModalProps> = ({ 
    visible, 
    onClose, 
    onSelect, 
    title, 
    selectedTime 
  }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-lg p-4 max-h-[70%]">
          <Text className="text-lg font-bold mb-4 text-center">{title}</Text>
          <FlatList
            data={timeSlots}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                className={`p-3 border-b border-gray-200 ${
                  item === selectedTime ? 'bg-green-100' : ''
                }`}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text className="text-center">{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity 
            className="mt-4 bg-gray-200 p-3 rounded"
            onPress={onClose}
          >
            <Text className="text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Time Selection Modals */}
      <TimeSelectionModal
        visible={isStartTimeModalVisible}
        onClose={() => setIsStartTimeModalVisible(false)}
        onSelect={setSelectedStartTime}
        title="Select Start Time"
        selectedTime={selectedStartTime}
      />
      <TimeSelectionModal
        visible={isEndTimeModalVisible}
        onClose={() => setIsEndTimeModalVisible(false)}
        onSelect={setSelectedEndTime}
        title="Select End Time"
        selectedTime={selectedEndTime}
      />

      {/* Header */}
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold">Secure Checkout</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Parking Location Details */}
        <View className="p-4 bg-gray-50 border-b border-gray-200">
          <Text className="font-bold text-lg">{parkingDetails.location}</Text>
          <View className="flex-row justify-between mt-2">
            <TouchableOpacity 
              className="flex-1 mr-2"
              onPress={() => setIsStartTimeModalVisible(true)}
            >
              <Text className="text-gray-600">Parking from</Text>
              <Text className="font-bold">{selectedStartTime}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 ml-2"
              onPress={() => setIsEndTimeModalVisible(true)}
            >
              <Text className="text-gray-600">Parking until</Text>
              <Text className="font-bold">{selectedEndTime}</Text>
            </TouchableOpacity>
          </View>
          <Text className="mt-2 font-bold">
            Total duration: {calculateDuration(selectedStartTime, selectedEndTime)}
          </Text>
          
          <TouchableOpacity className="mt-4 bg-green-500 p-2 rounded items-center">
            <Text className="text-white">+ Add additional booking</Text>
          </TouchableOpacity>
        </View>

        {/* Insurance Option */}
        <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
          <View className="flex-1 mr-4">
            <Text className="font-bold">Insurance</Text>
            <Text className="text-gray-600 text-sm">
              Parking peace of mind. If something happens to your car while you're parked, we'll refund 100% of the excess on your insurance up to £1,000!
            </Text>
          </View>
          <Switch
            value={isInsuranceEnabled}
            onValueChange={setIsInsuranceEnabled}
          />
        </View>

        {/* Personal Details */}
        <View className="p-4 border-b border-gray-200">
          <View className="mb-4">
            <Text className="font-bold text-lg mb-2">Personal details</Text>
            <Text>{personalDetails.name}</Text>
            <Text>{personalDetails.email}</Text>
          </View>
          
          <View>
            <Text className="text-gray-600 mb-2">Phone number (in case you need to be contacted)</Text>
            <View className="flex-row items-center">
              <Text className="mr-2">+44</Text>
              <Text>{personalDetails.phone}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Details */}
        <TouchableOpacity className="p-4 border-b border-gray-200 flex-row justify-between items-center">
          <View>
            <Text className="font-bold text-lg">Vehicle details</Text>
            <Text className="text-gray-600">
              {vehicleDetails ? vehicleDetails.name : "Tap to add vehicle"}
            </Text>
          </View>
          <Text className="text-green-500 text-lg">+</Text>
        </TouchableOpacity>

        {/* Payment Details */}
        <View className="p-4 border-b border-gray-200">
          <Text className="font-bold text-lg mb-2">Payment details</Text>
          <View className="flex-row justify-between items-center">
            <Text>Google Pay</Text>
            <TouchableOpacity>
              <Text className="text-green-500">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Breakdown */}
        <View className="p-4">
          <View className="flex-row justify-between mb-2">
            <Text>Parking fee</Text>
            <Text>£{parkingDetails.parkingFee.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text>Transaction fee</Text>
            <Text>£{parkingDetails.transactionFee.toFixed(2)}</Text>
          </View>
          {isInsuranceEnabled && (
            <View className="flex-row justify-between mb-2">
              <Text>Insurance</Text>
              <Text>£{parkingDetails.insuranceFee.toFixed(2)}</Text>
            </View>
          )}
          <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
            <Text className="font-bold">Final price</Text>
            <Text className="font-bold">£{calculateTotalPrice()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity 
        className="p-4 bg-green-500 items-center"
        onPress={() => {
          // Implement booking confirmation logic
          Alert.alert("Booking Confirmed", "Your parking has been reserved!");
        }}
      >
        <Text className="text-white font-bold text-lg">
          £{calculateTotalPrice()} - Pay and reserve
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParkingBookingScreen;

