import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { ChevronLeft, Home } from 'lucide-react-native';
import { router } from 'expo-router';

// Define the AccessInstructions component
const AccessInstructions = () => {
  // State variables to track progress and user input
  const [step, setStep] = useState(0); // Tracks the current step (0, 1, or 2)
  const [hasGatedEntry, setHasGatedEntry] = useState(null); // Tracks if there's a gated entry (true/false/null)
  const [permitType, setPermitType] = useState(''); // Stores permit type input
  const [collectionInstructions, setCollectionInstructions] = useState(''); // Stores collection instructions
  const [noticeHours, setNoticeHours] = useState(0); // Stores notice period in hours


  const gotoprice = () => {
        console.log("Renting Process 6 Starts")
        router.push("/(root)/pricing");
    
      };

  // Array defining the 3 steps with their titles, questions, and UI components
  const steps = [
    {
      title: 'Gated Entry',
      question: 'Does your space have gated entry or requires a permit?',
      component: (
        <View className="flex-1 justify-center items-center px-6 space-y-6">
          {/* Icon to visually represent the step */}
          <Home size={80} className="text-gray-600 mb-4" />
          {/* Display the step's question */}
          <Text className="text-xl font-bold text-gray-800 text-center">
            Does your space have gated entry or requires a permit?
          </Text>
          {/* Buttons for user choice */}
          <View className="w-full space-y-4">
            <TouchableOpacity 
              className="bg-general-400 p-4 rounded-lg"
              onPress={() => {
                setHasGatedEntry(true); // User selects "Yes"
                setStep(1); // Move to next step
              }}
            >
              <Text className="text-white text-center font-semibold">Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="border border-general-400 p-4 rounded-lg"
              onPress={() => {
                setHasGatedEntry(false); // User selects "No"
                setStep(1); // Move to next step
              }}
            >
              <Text className="text-blue-500 text-center font-semibold">No</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    },
    {
      title: 'Permit Details',
      question: 'What type of permit does your space require?',
      component: (
        <View className="flex-1 justify-center px-6 space-y-6">
          {/* Display the step's question */}
          <Text className="text-xl font-bold text-gray-800">
            What type of permit does your space require?
          </Text>
          {/* Informational text */}
          <Text className="text-sm text-gray-600">
            Only EasePark will see this description when processing your space.
          </Text>
          {/* Input field for permit type */}
          <TextInput
            className="border border-gray-300 p-4 rounded-lg"
            placeholder="Select permit type"
            value={permitType}
            onChangeText={setPermitType} // Updates permitType state
          />
          {/* Additional question */}
          <Text className="text-sm text-gray-600 mb-2">
            If it's a residential property, are non-residents allowed to use it?
          </Text>
          {/* Continue button */}
          <TouchableOpacity 
            className="bg-general-400 p-4 rounded-lg"
            onPress={() => setStep(2)} // Move to next step
          >
            <Text className="text-white text-center font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
      )
    },
    {
      title: 'Collection Details',
      question: 'How will permits be collected?',
      component: (
        <View className="flex-1 justify-center px-6 space-y-6">
          {/* Display the step's question */}
          <Text className="text-xl font-bold text-gray-800 mb-4">
            How will permits be collected?
          </Text>
          {/* Multiline input for collection instructions */}
          <TextInput
            className="border border-gray-300 p-4 rounded-lg h-24"
            placeholder="E.g. please collect from the property"
            multiline
            value={collectionInstructions}
            onChangeText={setCollectionInstructions} // Updates collectionInstructions state
          />
          {/* Notice period section */}
          <View className="space-y-4">
            <Text className="text-lg font-semibold">Notice Period</Text>
            <Text className="text-sm text-gray-600 mb-2">
              Shorter notice should result in more bookings.
            </Text>
            <View className="flex-row items-center justify-between">
              {/* Decrease notice hours */}
              <TouchableOpacity 
                onPress={() => setNoticeHours(Math.max(0, noticeHours - 1))} // Ensures no negative values
                className="bg-gray-200 p-2 rounded-full"
              >
                <Text className="text-xl">-</Text>
              </TouchableOpacity>
              {/* Display current notice hours */}
              <Text className="text-xl">{noticeHours} Hours</Text>
              {/* Increase notice hours */}
              <TouchableOpacity 
                onPress={() => setNoticeHours(noticeHours + 1)}
                className="bg-gray-200 p-2 rounded-full"
              >
                <Text className="text-xl">+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Continue button (submit logic placeholder) */}
          <TouchableOpacity 
            className="bg-general-400 p-4 rounded-lg mt-4"
            onPress={gotoprice}
          >
            <Text className="text-white text-center font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
      )
    }
  ];

  // Main UI rendering
  return (
    <View className="flex-1 bg-white">
      {/* Header with back button and title */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        {step > 0 && ( // Show back button only on steps 1 and 2
          <TouchableOpacity 
            onPress={() => setStep(Math.max(0, step - 1))} // Go back, but not before step 0
            className="mr-4"
          >
            <ChevronLeft size={24} />
          </TouchableOpacity>
        )}
        <Text className="text-lg font-semibold">{steps[step].title}</Text>
      </View>
      {/* Step indicators (dots showing progress) */}
      <View className="flex-row justify-center space-x-2 my-4">
        {steps.map((_, index) => (
          <View
            key={index}
            className={`w-3 h-3 rounded-full ${index === step ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </View>
      {/* Render the current step's component */}
      {steps[step].component}
    </View>
  );
};

// Export the component
export default AccessInstructions;