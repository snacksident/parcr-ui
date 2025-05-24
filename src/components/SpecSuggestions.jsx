import React from 'react'
import { shaftMakers, gripMakers } from '../config/specConfig'

export default function SpecSuggestions({ 
  type, 
  currentValue, 
  onSelect,
  maker = null 
}) {
  const renderShaftSuggestions = () => {
    // If no maker selected yet, show maker options
    if (!maker) {
      return Object.values(shaftMakers).map(manufacturer => (
        <button
          key={manufacturer.name}
          onClick={() => onSelect('maker', manufacturer.name)}
          className="suggestionBtn"
        >
          {manufacturer.name}
        </button>
      ))
    }

    // If maker selected, show model options
    const makerData = shaftMakers[maker]
    if (!makerData) return null

    return (
      <div className="suggestionGrid">
        {Object.entries(makerData.models).map(([modelName, modelData]) => (
          <div key={modelName} className="modelGroup">
            {modelData.variations.map(variation => (
              <button
                key={variation}
                onClick={() => onSelect('model', `${variation}`)}
                className="suggestionBtn"
              >
                {variation}
                {modelData.premium?.map(premium => (
                  <span key={premium} className="premiumOption">
                    + {premium}
                  </span>
                ))}
              </button>
            ))}
          </div>
        ))}
      </div>
    )
  }

  const renderGripSuggestions = () => {
    // If no maker selected, show maker options
    if (!maker) {
      return Object.values(gripMakers).map(manufacturer => (
        <button
          key={manufacturer.name}
          onClick={() => onSelect('maker', manufacturer.name)}
          className="suggestionBtn"
        >
          {manufacturer.name}
        </button>
      ))
    }

    // If maker selected, show model and size options
    const makerData = gripMakers[maker]
    if (!makerData) return null

    return (
      <div className="suggestionContainer">
        <div className="modelGrid">
          {makerData.models.map(model => (
            <button
              key={model}
              onClick={() => onSelect('model', model)}
              className="suggestionBtn"
            >
              {model}
            </button>
          ))}
        </div>
        <div className="sizeGrid">
          {makerData.sizes.map(size => (
            <button
              key={size}
              onClick={() => onSelect('size', size)}
              className="suggestionBtn sizeBtn"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="suggestionsWrapper">
      {type === 'shaft' && renderShaftSuggestions()}
      {type === 'grip' && renderGripSuggestions()}
    </div>
  )
}