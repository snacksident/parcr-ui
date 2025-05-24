const generateCustomLabel = (clubData) => {
  // Create components in exact order without spaces
  const components = [
    clubData.sku,                                             // e.g., "4ping4"
    clubData.requiredFields.trade_in_condition?.currentValue, // e.g., "B"
    clubData.requiredFields.custom_label?.currentValue,       // e.g., "12341234"
    clubData.requiredFields.location_tag?.currentValue,       // e.g., "IO3"
    clubData.inventory?.quantity?.toString()                  // e.g., "1"
  ]
  
  return components
    .filter(Boolean)  // Remove any null/undefined/empty values
    .join('')        // Join without spaces
}

export const createMetafields = (clubData) => {
  const metafields = []
  
  // Use the helper function
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

  // Add specs and additional fields
  const additionalFields = {
    handedness: clubData.specs?.handedness,
    additional_notes: clubData.preservedFields.additionalNotes,
    club_manufacturer: clubData.manufacturer,
    model: clubData.model
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

export const transformDataForShopify = (clubData) => {
  if (!clubData.requiredFields) {
    throw new Error('No specification data available')
  }

  // Build title components
  const titleComponents = [
    clubData.specs?.handedness === 'Left-Handed' ? 'LEFTY' : null,
    clubData.model,
    clubData.manufacturer,
    clubData.requiredFields.club_number?.currentValue?.toUpperCase(),
    clubData.requiredFields.flex?.currentValue,
    clubData.requiredFields.shaft_make_model?.currentValue,
    clubData.requiredFields.item_length?.currentValue ? 
      `${clubData.requiredFields.item_length.currentValue}"` : null,
    clubData.requiredFields.condition?.currentValue,
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
      clubData.model,
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
