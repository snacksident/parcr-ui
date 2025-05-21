import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubData } from '../context/GlobalStateContext';
import { pingDotColors } from '../components/DotColorPrompt';
import PromptModal from '../components/PromptModal';
import '../App.css'; // Add this import

export default function EnterSpecs() {
  const navigate = useNavigate()
  const { clubData, updateClubData, updateSpecs, userData } = useClubData()
  const [formData, setFormData] = useState({})
  const [showDotColorPrompt, setShowDotColorPrompt] = useState(false)

  const clubNumbers = [
    '1-Wood', '2-Wood', '3-Wood', '3HL-Wood', '4-Wood', '5-Wood', '5HL-Wood',
    '6-Wood', '7-Wood', '7HL-Wood', '8-Wood', '9-Wood', '11-Wood',
    'Fairway Wood', 'Heavenwood', 'Utility Wood',
    '1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H',
    'Hybrid', 'Utility Iron',
    '1-Iron', '2-Iron', '3-Iron', '4-Iron', '5-Iron', '6-Iron', '7-Iron', '8-Iron', '9-Iron', '10-Iron', '11-Iron',
    'Iron Set',
    'Pitching Wedge', 'Gap Wedge', 'Sand Wedge', 'Lob Wedge',
    'Chipper', 'Putter', 'Complete Club Set',
  ]
  const flexOptions = [
    'WEDGE', 'LADIES', 'SENIORS', 'REGULAR', 'STIFF', 'EXTRA STIFF',
    'SOFT REGULAR', 'TOUR REGULAR', 'TOUR STIFF', 'TOUR EXTRA STIFF', 
    'STIFF+', 'FIRM', 'STIFF REGULAR', 'UNIFLEX', 'REGULAR+', 'LIGHT', 'LIGHT TOUR',
    'LITE', 'LADIES REGULAR', 'ULTRA LITE', 'JUNIOR', 'AUTOFLEX', 'COMBO FLEX',
  ]

  const shaftMaterials = [
    'Graphite', 'Steel', 'Steelfiber', 'Hickory', 'Steel and Graphite'
  ]

  const conditionOptions = [
    'BRAND NEW',
    'DEMO',
    'COMING SOON',
    'VERY GOOD',
    'GOOD',
    'FAIR',
    'POOR'
  ];

  // Add this constant at the top of your component with the other constants
  const fieldOrder = [
    'club_number',
    'flex',
    'shaft_material',
    'shaft_make_model',
    'grip_make_model_size',
    'item_length',
    'custom_label',
    'initials_staff_use_only_'
  ];

  useEffect(() => {
    if (clubData?.requiredFields) {
      // Initialize form with current values from requiredFields
      const initialFormData = Object.entries(clubData.requiredFields)
        .reduce((acc, [key, field]) => {
          // Skip the regular 'initials' field
          if (key === 'initials') return acc;
          
          return {
            ...acc,
            [key]: field?.currentValue === 'COMING SOON' ? '' : field?.currentValue || ''
          };
        }, {});

      // Set the staff initials field with userData.initials
      initialFormData.initials_staff_use_only_ = userData.initials;
      
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
        setShowDotColorPrompt(true);
      }
    }
  }, [clubData.requiredFields, userData.initials]); // Change dependency to only requiredFields

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    const additionalNotes = formData.additional_notes || '';
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
              userData.initials : // Always use userData.initials for staff field
              formData[key] || field.currentValue
          }
        };
      }, {});

    // Add location_tag to requiredFields
    if (formData.location_tag) {
      updatedRequiredFields.location_tag = {
        key: 'location_tag',
        type: 'single_line_text_field',
        namespace: 'custom',
        currentValue: formData.location_tag
      };
    }

    // Update the condition metafield in the submitForm function
    updatedRequiredFields.condition = {
      key: 'condition',
      type: 'list.single_line_text_field', // Change the type here
      namespace: 'custom',
      currentValue: formData.condition || 'BRAND NEW' // This value will be wrapped in an array
    };

    // When updating clubData, we need to ensure the condition is in array format
    updateClubData({
      ...clubData,
      requiredFields: {
        ...updatedRequiredFields,
        condition: {
          ...updatedRequiredFields.condition,
          currentValue: [updatedRequiredFields.condition.currentValue] // Wrap in array
        }
      },
      preservedFields: {
        ...clubData.preservedFields,
        additionalNotes: formData.additional_notes || ''
      },
      specs: {
        ...clubData.specs
        // pingDotColor is already in specs from earlier update
      }
    });

    navigate('/submission-details');
  };

  // Update the renderRequiredFields function
  const renderRequiredFields = () => {
    if (!clubData?.requiredFields) return null;

    return fieldOrder
      .filter(key => {
        // Skip fields we don't want to show
        if (key === 'handedness' || key === 'initials') return false;
        // Only include fields that exist in requiredFields
        return clubData.requiredFields[key];
      })
      .map(key => {
        const field = clubData.requiredFields[key];
        if (!field) return null;

        const displayLabel = field.key ? field.key.replace(/_/g, ' ').toUpperCase() : key.replace(/_/g, ' ').toUpperCase();
        const shouldUseSelect = (
          key === 'club_number' || 
          key === 'flex' || 
          key === 'shaft_material'
        );
        
        const options = key === 'club_number' ? clubNumbers : 
                       key === 'flex' ? flexOptions :
                       key === 'shaft_material' ? shaftMaterials : 
                       null;

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
        );
      });
  }

  if (!clubData?.requiredFields || Object.keys(clubData.requiredFields).length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>No Template Found</h1>
        <p>Please scan a valid club barcode first.</p>
      </div>
    );
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

        <button type="submit" className="submitButton">
          Review And Upload
        </button>
      </form>
    </div>
  );
}
