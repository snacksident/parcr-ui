
const manufacturers = {
    'ADAM': 'Adams Golf',
    'BRID': 'Bridgestone',
    'CALL': 'Callaway',
    'CLEV': 'Cleveland',
    'COBR': 'Cobra',
    'GX7': 'Gx7',
    'HONM': 'Honma',
    'KRAN': 'Krank',
    'MACG': 'MacGregor',
    'MIZU': 'Mizuno',
    'NIKE': 'Nike',
    'PING': 'Ping',
    'PXG': 'PXG',
    'SRIX': 'Srixon',
    'TAYL': 'TaylorMade',
    'TITL': 'Titleist',
    'TOPF': 'Top Flite',
    'XXIO': 'XXIO',
    'MIZU': 'Mizuno',
  }
  
  export const parseSKU = (sku) => {
    if (!sku || sku.length < 7) return null
  
    // Extract components
    // const clubNumber = sku.charAt(0)
    const manufacturerCode = sku.substring(1, 5).trim()
    const modelCode = sku.substring(5, 7)
    
    // Find full manufacturer name
    const manufacturer = manufacturers[manufacturerCode] || manufacturerCode
  
    return {
      // clubNumber,
      manufacturer,
      modelCode
    };
  };