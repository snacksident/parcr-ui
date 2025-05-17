import React, { createContext, useContext, useState } from 'react'

const GlobalStateContext = createContext()

export function GlobalStateProvider({ children }) {
  const [clubData, setClubData] = useState({
    templateId: '',
    manufacturer: '',
    productType: '',
    sku: '',
    preservedFields: {
      manufacturer: '',
      golfClubType: '',
      model: ''
    },
    requiredFields: {
      club_number: {
        key: 'club_number',
        type: 'single_line_text_field',
        namespace: 'custom',
        currentValue: 'COMING SOON'
      },
      custom_label: {
        key: 'custom_label',
        type: 'single_line_text_field',
        namespace: 'custom',
        currentValue: 'COMING SOON'
      },
      flex: {
        key: 'flex',
        type: 'single_line_text_field',
        namespace: 'custom',
        currentValue: 'COMING SOON'
      },
      // ... other required fields
    },
    images: [],
    currentStep: 1,
    specs: {
      handedness: null,
      putterType: null,
      pingDotColor: null // Add this new field
    }
  });

  const updateClubData = (newData) => {
    setClubData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const updateRequiredField = (fieldKey, value) => {
    setClubData(prev => ({
      ...prev,
      requiredFields: {
        ...prev.requiredFields,
        [fieldKey]: {
          ...prev.requiredFields[fieldKey],
          currentValue: value
        }
      }
    }));
  };

  const updateCurrentStep = (step) => {
    setClubData(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  const resetClubData = () => {
    setClubData({
      templateId: '',
      manufacturer: '',
      productType: '',
      sku: '',
      preservedFields: {
        manufacturer: '',
        golfClubType: '',
        model: ''
      },
      requiredFields: {
        club_number: {
          key: 'club_number',
          type: 'single_line_text_field',
          namespace: 'custom',
          currentValue: 'COMING SOON'
        },
        custom_label: {
          key: 'custom_label',
          type: 'single_line_text_field',
          namespace: 'custom',
          currentValue: 'COMING SOON'
        },
        flex: {
          key: 'flex',
          type: 'single_line_text_field',
          namespace: 'custom',
          currentValue: 'COMING SOON'
        },
        // ... other required fields
      },
      images: [],
      currentStep: 1,
      specs: {
        handedness: null,
        putterType: null,
        pingDotColor: null // Add this new field
      }
    })
  }

  // Add a helper function to update specs
  const updateSpecs = (newSpecs) => {
    setClubData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        ...newSpecs
      }
    }));
  };

  return (
    <GlobalStateContext.Provider value={{ 
      clubData, 
      updateClubData,
      updateRequiredField,
      updateCurrentStep,
      resetClubData,
      updateSpecs // Add this to the context
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useClubData() {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useClubData must be used within a GlobalStateProvider')
  }
  return context
}