export const fieldConfigs = {
    condition: {
      type: 'select',
      options: ['New', 'Very Good', 'Good', 'Fair', 'Poor']
    },
    manufacturer: {
      type: 'autocomplete',
      suggestions: ['Adams', 'Bridgestone', 'Callaway', 'Cleveland',  'Cobra', 'Gx7', 'Honma', 'Krank', 'Macgregor', 'Mizuno', 'Nike', 'Ping', 'PXG', 'Srixon', 'TaylorMade', 'Titleist', 'Top Flite', 'Tour Edge', 'Tour X', 'US KIDS GOLF', 'Vertical Groove', 'VLS Golf', 'Wilson Staff', 'XXIO', 'Yamaha']
    },
    model: {
      type: 'text'
    },
    flex: {
      type: 'select',
      options: ['Ladies', 'Seniors', 'Regular', 'Stiff', 'Extra Stiff', 'Soft Regular', 'Tour Stiff', 'Tour Extra Stiff', 'Firm', 'Light', 'Lite', 'Junior']
    },
    loft: {
      type: 'number',
      suffix: '°',
      min: 0,
      max: 69
    },
    'shaft_make_model': {
      type: 'text'
    },
    'shaft_material': {
      type: 'select',
      options: ['Steel', 'Graphite', 'Steelfiber', 'Steel and Graphite']
    },
    'club_length': {
      type: 'number',
      suffix: '"',
      min: 30,
      max: 48
    },
    'grip_make_model_size': {
      type: 'text'
    },
    handedness: {
      type: 'select',
      options: ['Right', 'Left']
    },
    'club_number': {
      type: 'select',
      options: ['Driver', '3 Wood', '5 Wood', '7 Wood', '9 Wood', '3 Iron', '4 Iron', '5 Iron', '6 Iron', '7 Iron', '8 Iron', '9 Iron', 'PW', 'SW', 'LW']
    },
    initials: {
      type: 'text'
    },
    'custom_label': {
      type: 'text'
    }
  };