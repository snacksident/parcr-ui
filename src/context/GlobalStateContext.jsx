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
    images: []
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
      images: []
    })
  }

  return (
    <GlobalStateContext.Provider value={{ 
      clubData, 
      updateClubData,
      updateRequiredField,
      resetClubData 
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