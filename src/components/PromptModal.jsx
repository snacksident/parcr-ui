import React from 'react';

const defaultButtonStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0.75rem',
  border: '1px solid #cbd5e0',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  minHeight: '60px',
  justifyContent: 'center',
  transition: 'all 0.2s ease'
}

export default function PromptModal({ 
  title, 
  options,
  onSelect, 
  onClose,
  selectedValue = null,
  renderOption = null,
  gridColumns = 'repeat(auto-fill, minmax(180px, 1fr))',
  description = null
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h3 style={{
          marginBottom: description ? '0.5rem' : '1.5rem',
          fontSize: '1.25rem',
          color: '#2c3e50',
          textAlign: 'center'
        }}>
          {title}
        </h3>
        
        {description && (
          <p style={{
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: '#4a5568',
            fontSize: '0.95rem'
          }}>
            {description}
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          {options.map((option) => {
            if (renderOption) {
              return renderOption(option, selectedValue, onSelect);
            }

            const isSelected = selectedValue === option.value || selectedValue === option;
            
            return (
              <button
                key={option.value || option}
                onClick={() => onSelect(option)}
                style={{
                  ...defaultButtonStyles,
                  backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                  borderColor: isSelected ? '#3182ce' : '#cbd5e0',
                  ...option.style
                }}
              >
                {option.content || option.label || option}
                {option.description && (
                  <span style={{
                    fontSize: '0.8rem',
                    color: '#718096',
                    marginTop: '0.25rem'
                  }}>
                    {option.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}