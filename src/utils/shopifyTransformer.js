export const createMetafields = (clubData) => {
  const metafields = [];
  
  // Add SKU/custom label
  const customLabel = [
    clubData.sku,
    clubData.requiredFields.custom_label?.currentValue,
    clubData.requiredFields.location_tag?.currentValue
  ].filter(Boolean).join(' ');

  if (customLabel) {
    metafields.push({
      key: 'sku',
      value: customLabel,
      type: 'single_line_text_field',
      namespace: 'custom'
    });
  }

  // Add preserved fields
  const preservedFieldMappings = {
    manufacturer: 'club_manufacturer',
    golfClubType: 'golf_club_type',
    model: 'model'
  };

  Object.entries(preservedFieldMappings).forEach(([key, metafieldKey]) => {
    if (clubData.preservedFields?.[key]) {
      metafields.push({
        key: metafieldKey,
        value: clubData.preservedFields[key],
        type: 'single_line_text_field',
        namespace: 'custom'
      });
    }
  });

  // Add required fields
  Object.entries(clubData.requiredFields || {}).forEach(([key, field]) => {
    if (field.currentValue && typeof field.currentValue === 'string') {
      metafields.push({
        key,
        value: field.currentValue,
        type: 'single_line_text_field',
        namespace: 'custom'
      });
    }
  });

  // Add specs and additional fields
  const additionalFields = {
    handedness: clubData.specs?.handedness,
    additional_notes: clubData.preservedFields.additionalNotes,
    club_manufacturer: clubData.manufacturer,
    model: clubData.model,
    custom_label: customLabel
  };

  Object.entries(additionalFields).forEach(([key, value]) => {
    if (value) {
      metafields.push({
        key,
        value,
        type: 'single_line_text_field',
        namespace: 'custom'
      });
    }
  });

  return metafields;
};

export const transformDataForShopify = (clubData) => {
  if (!clubData.requiredFields) {
    throw new Error('No specification data available');
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
  ].filter(Boolean);

  // Get metafields
  const metafields = createMetafields(clubData);

  // Create custom label
  const customLabel = [
    clubData.sku,
    clubData.requiredFields.custom_label?.currentValue,
    clubData.requiredFields.location_tag?.currentValue
  ].filter(Boolean).join(' ');

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
  };
};
