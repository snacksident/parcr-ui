const generateCustomLabel = (clubData) => {
  // Create components in exact order with specific spacing
  const components = [
    clubData.sku,                                             // e.g., "4call13"
    clubData.requiredFields.trade_in_condition?.currentValue, // e.g., "B"
    clubData.requiredFields.custom_label?.currentValue,       // e.g., "12341234"
    clubData.requiredFields.location_tag?.currentValue,       // e.g., "IO3"
    clubData.inventory?.quantity?.toString()                  // e.g., "1"
  ]
  
  return components
    .filter(Boolean)  // Remove any null/undefined/empty values
    .join(' ')       // Join with spaces between components
}

export const createMetafields = (clubData) => {
  const metafields = []
  
  // Use the helper function once to generate the custom label
  const customLabel = generateCustomLabel(clubData)

  if (customLabel) {
    metafields.push({
      key: 'sku',
      value: customLabel,
      type: 'single_line_text_field',
      namespace: 'custom'
    })
  }

  // Add preserved fields
  const preservedFieldMappings = {
    manufacturer: 'club_manufacturer',
    golfClubType: 'golf_club_type',
    model: 'model'
  }

  Object.entries(preservedFieldMappings).forEach(([key, metafieldKey]) => {
    if (clubData.preservedFields?.[key]) {
      metafields.push({
        key: metafieldKey,
        value: clubData.preservedFields[key],
        type: 'single_line_text_field',
        namespace: 'custom'
      })
    }
  })

  // Add required fields
  Object.entries(clubData.requiredFields || {}).forEach(([key, field]) => {
    if (field.currentValue && typeof field.currentValue === 'string') {
      metafields.push({
        key,
        value: field.currentValue,
        type: 'single_line_text_field',
        namespace: 'custom'
      })
    }
  })

  // Modify the additionalFields to remove redundant fields
  const additionalFields = {
    handedness: clubData.specs?.handedness,
    additional_notes: clubData.preservedFields.additionalNotes,
    club_manufacturer: clubData.manufacturer,
    model: clubData.model
    // Remove any fields that might duplicate the custom label components
  }

  Object.entries(additionalFields).forEach(([key, value]) => {
    if (value) {
      metafields.push({
        key,
        value,
        type: 'single_line_text_field',
        namespace: 'custom'
      })
    }
  })

  return metafields
}

// Add this helper function to extract year from model
const extractYearAndModel = (modelString) => {
  // Look for a 4-digit year pattern
  const yearMatch = modelString.match(/\b(19|20)\d{2}\b/)
  
  if (yearMatch) {
    const year = yearMatch[0]
    // Remove the year from the model name and clean up extra spaces
    const model = modelString.replace(year, '').trim()
    return { year, model }
  }
  
  return { year: null, model: modelString }
}

export const transformDataForShopify = (clubData) => {
  if (!clubData.requiredFields) {
    throw new Error('No specification data available')
  }

  // Extract year and clean model name
  const { year, model } = extractYearAndModel(clubData.model || '')

  // Helper to format wedge specs
  const getWedgeSpecs = () => {
    const isWedge = 
      clubData.productType?.toLowerCase() === 'wedges' || 
      clubData.requiredFields.club_number?.currentValue?.toLowerCase().includes('wedge')

    if (!isWedge) return null

    const loft = clubData.requiredFields.loft?.currentValue
    const bounce = clubData.requiredFields.bounce?.currentValue
    
    if (loft && bounce) {
      return `${loft}*/${bounce}`
    }
    return null
  }

  // Build title components in desired order
  const titleComponents = [
    clubData.specs?.handedness === 'Left-Handed' ? 'LEFTY' : null,
    year,                                                              // e.g., "2019"
    clubData.manufacturer,                                             // e.g., "TAYLORMADE"
    model,                                                            // e.g., "P790"
    clubData.requiredFields.club_number?.currentValue?.toUpperCase(), // e.g., "4 IRON" or "GAP WEDGE"
    getWedgeSpecs(),                                                  // e.g., "56°/12°" (for wedges only)
    clubData.requiredFields.flex?.currentValue,                       // e.g., "STIFF"
    clubData.requiredFields.shaft_make_model?.currentValue,           // e.g., "KBS C-TAPER"
    clubData.requiredFields.item_length?.currentValue ? 
      `${clubData.requiredFields.item_length.currentValue}"` : null,  // e.g., '38"'
    clubData.requiredFields.condition?.currentValue,                  // e.g., "GOOD"
  ].filter(Boolean)

  // Get metafields
  const metafields = createMetafields(clubData)

  // Use the same helper function for consistency
  const customLabel = generateCustomLabel(clubData)

  return {
    title: titleComponents.join(' '),
    productType: clubData.productType,
    metafields,
    sku: customLabel,
    vendor: clubData.manufacturer || 'Unknown',
    tags: [
      clubData.productType,
      clubData.manufacturer,
      model, // Use cleaned model name
      year,  // Add year as a tag
      clubData.requiredFields.flex?.currentValue,
      clubData.requiredFields.shaft_material?.currentValue
    ].filter(Boolean),
    status: 'DRAFT',
    options: [{
      name: 'Condition',
      values: [clubData.requiredFields.condition?.currentValue]
    }]
  }
}
