import { useGlobalState } from '../context/GlobalStateContext'

export function useClubData() {
  const { clubData, setClubData } = useGlobalState()
  

  const getClubTypeFromSKU = (sku) => {
    if (!sku) return null
    
    const clubTypes = {
      '1': 'driver',
      '2': 'fairway',
      '3': 'hybrid',
      '4': 'iron',
      '5': 'wedge',
      '6': 'putter',
      '7': 'shaft',
      '8': 'item'
    }

    const firstChar = sku.charAt(0);
    return clubTypes[firstChar] || null;
  }

  const updateClubData = (updates) => {
    // If there's a SKU in the updates, determine the club type
    if (updates.sku) {
      const clubType = getClubTypeFromSKU(updates.sku)
      console.log('Detected club type:', clubType)
      setClubData((prev) => ({
        ...prev,
        ...updates,
        type: clubType // Add club type to the data
      }))
    } else {
      setClubData((prev) => ({ ...prev, ...updates }))
    }
  };

  const resetClubData = () => {
    setClubData({
      sku: '',
      images: [],
      specs: {
        brand: '',
        model: '',
        year: '',
        condition: '',
        flex: '',
        shaftInfo: '',
        headcover: false,
      },
    })
  }

  return { clubData, updateClubData, resetClubData, getClubTypeFromSKU }
}