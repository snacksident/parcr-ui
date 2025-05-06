import { useGlobalState } from '../context/GlobalStateContext';

export function useClubData() {
  const { clubData, setClubData } = useGlobalState();

  const updateClubData = (updates) => {
    setClubData((prev) => ({ ...prev, ...updates }));
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
    });
  };

  return { clubData, updateClubData, resetClubData };
}