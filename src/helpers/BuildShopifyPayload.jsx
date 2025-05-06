/**
 * 
 * THIS FUNCTION WILL BUILD THE PAYLOAD FOR ALL THE INFORMATION THE USER ENTERED IN PREVIOUS STEPS, AND CREATE THE LISTING ON SHOPIFY. 
 */

export function buildShopifyPayload(clubData) {
    const { specs, images } = clubData;
  
    return {
      product: {
        title: `${specs.year} ${specs.brand} ${specs.model} ${specs.flex} ${specs.shaftInfo}`,
        body_html: `<p>${specs.condition} condition ${specs.model} with ${
          specs.headcover ? 'headcover included' : 'no headcover'
        }.</p>`,
        images: images.map((src) => ({ src })),
        variants: [
          {
            option1: 'Default Title',
            price: specs.price || '0.00', // Add price if available
          },
        ],
      },
    };
  }