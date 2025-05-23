import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubData } from '../context/GlobalStateContext'
import { pingDotColors } from '../components/DotColorPrompt'
import PromptModal from '../components/PromptModal'
import SpecSuggestions from '../components/SpecSuggestions'
import { 
  clubTypeConfig, 
  flexOptions, 
  shaftMaterials, 
  conditionOptions 
} from '../config/clubTypeConfig'
import '../App.css'

export default function EnterSpecs() {
  const navigate = useNavigate()
  const { clubData, updateClubData, updateSpecs, userData } = useClubData()
  const [formData, setFormData] = useState({})
  const [showDotColorPrompt, setShowDotColorPrompt] = useState(false)
  const [inventoryData, setInventoryData] = useState({
    quantity: 1
  })
  const [activeSuggestion, setActiveSuggestion] = useState(null)
  const [selectedMaker, setSelectedMaker] = useState(null)

  // Get filtered club numbers based on product type
  const clubNumbers = useMemo(() => {
    const productType = clubData.productType
    
    // Find matching club type configuration
    const matchingType = Object.entries(clubTypeConfig).find(([type]) => 
      productType.toLowerCase().includes(type.toLowerCase())
    )

    return matchingType ? matchingType[1].numbers : []
  }, [clubData.productType])

  const fieldOrder = [
    'club_number',
    'flex',
    'shaft_material',
    'shaft_make_model',
    'grip_make_model_size',
    'item_length',
    'bounce',
    'loft',
    'custom_label',
    'initials_staff_use_only_'
  ]

  useEffect(() => {
    if (clubData?.requiredFields) {
      // Initialize form with current values from requiredFields
      const initialFormData = Object.entries(clubData.requiredFields)
        .reduce((acc, [key, field]) => {
          // Skip the regular 'initials' field
          if (key === 'initials') return acc
          
          return {
            ...acc,
            [key]: field?.currentValue === 'COMING SOON' ? '' : field?.currentValue || ''
          }
        }, {})

      // Set the staff initials field with userData.initials
      initialFormData.initials_staff_use_only_ = userData.initials
      
      console.log('Initial Form Data:', initialFormData)
      setFormData(initialFormData)

      // Only show the dot color prompt if we haven't selected a color yet
      if (
        !clubData.specs?.pingDotColor && // Add this condition
        clubData.manufacturer?.toUpperCase() === 'PING' && 
        (clubData.productType === 'Individual Irons' || 
         clubData.productType === 'Iron Set' || 
         clubData.productType?.toUpperCase().includes('WEDGE'))
      ) {
        setShowDotColorPrompt(true)
      }
    }
  }, [clubData.requiredFields, userData.initials]) // Change dependency to only requiredFields

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Update the dot color selection handler
  const handleDotColorSelect = React.useCallback((dot) => {
    // Update specs with the selected dot color info
    updateSpecs({
      ...clubData.specs,
      pingDotColor: dot
    })

    // Update the additional notes to include dot color information
    const additionalNotes = formData.additional_notes || ''
    const dotColorNote = `PING DOT COLOR: ${dot.color} (${dot.angle} - ${dot.description})`
    
    setFormData(prev => ({
      ...prev,
      additional_notes: additionalNotes ? `${dotColorNote}\n${additionalNotes}` : dotColorNote
    }))

    setShowDotColorPrompt(false)
  }, [clubData.specs, formData.additional_notes, updateSpecs])

  // Add memo for the dot color prompt
  const renderDotColorPrompt = React.useMemo(() => {
    if (!showDotColorPrompt) return null;
    
    return (
      <PromptModal
        title="Select PING Dot Color"
        description="Choose the dot color that matches your club's color code"
        options={pingDotColors.map(dot => ({
          value: dot,
          content: (
            <>
              <span style={{
                color: dot.textColor,
                fontWeight: 'bold',
                marginBottom: '0.25rem',
                textShadow: dot.color === 'White' ? '0 0 1px #000' : 'none'
              }}>
                {dot.color}
              </span>
              <span style={{
                fontSize: '0.9rem',
                color: '#4a5568'
              }}>
                {dot.angle}
              </span>
              <span style={{
                fontSize: '0.8rem',
                color: '#718096',
                textAlign: 'center'
              }}>
                {dot.description}
              </span>
            </>
          ),
          style: {
            backgroundColor: clubData.specs?.pingDotColor?.color === dot.color ? '#f0f9ff' : '#ffffff',
            borderColor: clubData.specs?.pingDotColor?.color === dot.color ? '#3182ce' : '#cbd5e0'
          }
        }))}
        onSelect={(option) => handleDotColorSelect(option.value)}
        onClose={() => setShowDotColorPrompt(false)}
        selectedValue={clubData.specs?.pingDotColor}
      />
    );
  }, [showDotColorPrompt, handleDotColorSelect, clubData.specs?.pingDotColor]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  const submitForm = () => {
    const updatedRequiredFields = Object.entries(clubData.requiredFields)
      .reduce((acc, [key, field]) => {
        // Skip the regular 'initials' field
        if (key === 'initials') return acc;

        return {
          ...acc,
          [key]: {
            ...field,
            currentValue: key === 'initials_staff_use_only_' ? 
              userData.initials : 
              formData[key] || field.currentValue
          }
        };
      }, {});

    // Add trade_in_condition to requiredFields
    updatedRequiredFields.trade_in_condition = {
      key: 'trade_in_condition',
      type: 'single_line_text_field',
      namespace: 'custom',
      currentValue: formData.trade_in_condition
    }

    // Add location_tag to requiredFields
    if (formData.location_tag) {
      updatedRequiredFields.location_tag = {
        key: 'location_tag',
        type: 'single_line_text_field',
        namespace: 'custom',
        currentValue: formData.location_tag
      }
    }

    // Update the condition metafield
    updatedRequiredFields.condition = {
      key: 'condition',
      type: 'list.single_line_text_field',
      namespace: 'custom',
      currentValue: formData.condition || 'BRAND NEW'
    }

    // Create inventory update data
    const inventoryUpdateData = {
      sku: clubData.sku,
      customLabel: formData.custom_label || '',
      locationTag: formData.location_tag || '',
      quantity: inventoryData.quantity
    }

    // When updating clubData, include all the fields
    updateClubData({
      ...clubData,
      requiredFields: {
        ...updatedRequiredFields,
        condition: {
          ...updatedRequiredFields.condition,
          currentValue: [updatedRequiredFields.condition.currentValue]
        }
      },
      preservedFields: {
        ...clubData.preservedFields,
        additionalNotes: formData.additional_notes || ''
      },
      specs: {
        ...clubData.specs
      },
      inventory: inventoryUpdateData
    })

    navigate('/submission-details');
  }

  // Update the renderRequiredFields function
  const renderRequiredFields = () => {
    if (!clubData?.requiredFields) return null

    return fieldOrder
      .filter(key => {
        if (key === 'handedness' || key === 'initials') return false
        if (key === 'club_number' && clubNumbers.length === 0) return false
        return clubData.requiredFields[key]
      })
      .map(key => {
        const field = clubData.requiredFields[key]
        if (!field) return null

        const displayLabel = field.key ? field.key.replace(/_/g, ' ').toUpperCase() : key.replace(/_/g, ' ').toUpperCase()
        const shouldUseSelect = (
          key === 'club_number' || 
          key === 'flex' || 
          key === 'shaft_material'
        )
        
        const options = key === 'club_number' ? clubNumbers : 
                       key === 'flex' ? flexOptions :
                       key === 'shaft_material' ? shaftMaterials : 
                       null

        return (
          <div key={key} className="formField">
            <label htmlFor={key} className="formLabel">
              {displayLabel}:
            </label>
            
            {shouldUseSelect ? (
              <select
                id={key}
                name={key}
                value={formData[key] || ''}
                onChange={handleInputChange}
                required
                className="formSelect"
              >
                <option value="">Select {displayLabel}</option>
                {options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key] || ''}
                onChange={handleInputChange}
                required
                className="formInput"
              />
            )}
          </div>
        )
      })
  }

  if (!clubData?.requiredFields || Object.keys(clubData.requiredFields).length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>No Template Found</h1>
        <p>Please scan a valid club barcode first.</p>
      </div>
    )
  }

  return (
    <div className="container">
      {renderDotColorPrompt}
      <h1 className="pageTitle">Enter Specifications</h1>
      
      <form onSubmit={handleSubmit}>
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Club Information</h2>
          </div>
          <div className="sectionContent">
            <div className="infoRow">
              <span className="label">SKU:</span>
              <span className="value">{clubData.sku}</span>
            </div>
            <div className="infoRow">
              <span className="label">Type:</span>
              <span className="value">{clubData.productType}</span>
            </div>
            <div className="infoRow">
              <span className="label">Manufacturer:</span>
              <span className="value">{clubData.manufacturer}</span>
            </div>
            <div className="infoRow">
              <span className="label">Model:</span>
              <span className="value">{clubData.model}</span>
            </div>
            <div className="infoRow">
              <span className="label">Handedness:</span>
              <span className="value">{clubData.requiredFields?.handedness || 'N/A'}</span>
            </div>
          
          </div>
        </section>

        <section className="formSection">
          <h3 className="sectionTitle">Required Specifications</h3>
          {renderRequiredFields()}
          <div className="formField">
            <label htmlFor="condition" className="formLabel">
              CONDITION:
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition || ''}
              onChange={handleInputChange}
              required
              className="formSelect"
            >
              <option value="">Select Condition</option>
              {conditionOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="formField">
            <label htmlFor="location_tag" className="formLabel">
              LOCATION TAG:
            </label>
            <input
              type="text"
              id="location_tag"
              name="location_tag"
              value={formData.location_tag || ''}
              onChange={handleInputChange}
              required
              className="formInput"
            />
          </div>

          <div className="formField">
            <label htmlFor="trade_in_condition" className="formLabel">
              TRADE-IN CONDITION:
            </label>
            <input
              type="text"
              id="trade_in_condition"
              name="trade_in_condition"
              value={formData.trade_in_condition || ''}
              onChange={(e) => {
                // Only allow single letter input
                const value = e.target.value.slice(0, 1).toUpperCase()
                handleInputChange({
                  target: {
                    name: 'trade_in_condition',
                    value
                  }
                })
              }}
              maxLength={1}
              className="formInput"
              required
            />
          </div>
        </section>

        <section className="formSection">
          <h3 className="sectionTitle">Additional Notes</h3>
          <div className="formField">
            <label htmlFor="additional_notes" className="formLabel">
              ADDITIONAL NOTES:
            </label>
            <textarea
              id="additional_notes"
              name="additional_notes"
              value={formData.additional_notes || ''}
              onChange={handleInputChange}
              className="formTextarea"
              placeholder="Enter any additional notes about this club..."
            />
          </div>
        </section>

        <section className="formSection">
          <h3 className="sectionTitle">Inventory Details</h3>
          <div className="formField">
            <label htmlFor="quantity" className="formLabel">
              QUANTITY:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={inventoryData.quantity}
              onChange={(e) => setInventoryData(prev => ({
                ...prev,
                quantity: parseInt(e.target.value) || 1
              }))}
              className="formInput"
            />
          </div>
        </section>

        {/* <section className="formSection">
          <h3 className="sectionTitle">Shaft and Grip Suggestions</h3>
          <div className="formField">
            <label htmlFor="shaft_make_model" className="formLabel">
              SHAFT MAKE & MODEL:
            </label>
            <div className="inputGroup">
              <input
                type="text"
                id="shaft_make_model"
                name="shaft_make_model"
                value={formData.shaft_make_model || ''}
                onChange={handleInputChange}
                className="formInput"
                placeholder="Enter shaft make and model"
              />
              <button
                type="button"
                onClick={() => {
                  setActiveSuggestion('shaft_make_model')
                  setSelectedMaker(null)
                }}
                className="suggestionTrigger"
              >
                Show Common Options
              </button>
            </div>
            {activeSuggestion === 'shaft_make_model' && (
              <SpecSuggestions
                type="shaft"
                currentValue={formData.shaft_make_model}
                onSelect={(type, value) => handleSuggestionSelect('shaft_make_model', type, value)}
                maker={selectedMaker}
              />
            )}
          </div>

          <div className="formField">
            <label htmlFor="grip_make_model_size" className="formLabel">
              GRIP MAKE, MODEL & SIZE:
            </label>
            <div className="inputGroup">
              <input
                type="text"
                id="grip_make_model_size"
                name="grip_make_model_size"
                value={formData.grip_make_model_size || ''}
                onChange={handleInputChange}
                className="formInput"
                placeholder="Enter grip make, model, and size"
              />
            </div>
          </div>
        </section> */}

        <button type="submit" className="submitButton">
          Review And Upload
        </button>
      </form>
    </div>
  )
}
