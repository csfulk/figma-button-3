require('dotenv').config();

exports.handler = async (event, context) => {
  const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
  const figmaFileId = process.env.FIGMA_FILE_ID; 

  // Dynamic import of node-fetch as an ES module
  const fetch = (await import('node-fetch')).default;

  const fileDataURL = `https://api.figma.com/v1/files/${figmaFileId}`;

  try {
    const fileResponse = await fetch(fileDataURL, {
      method: 'GET',
      headers: {
        'X-Figma-Token': figmaToken
      }
    });

    if (!fileResponse.ok) {
      throw new Error(`Figma API responded with status: ${fileResponse.status}`);
    }

    const fileData = await fileResponse.json();

    if (!fileData.styles) {
      throw new Error('No styles found in the file data');
    }

    const styles = fileData.styles;
    const styleDetails = await Promise.all(Object.keys(styles).map(async (styleId) => {
      const styleInfoURL = `https://api.figma.com/v1/files/${figmaFileId}/styles/${styleId}`;

      const styleResponse = await fetch(styleInfoURL, {
        method: 'GET',
        headers: {
          'X-Figma-Token': figmaToken
        }
      });

      if (!styleResponse.ok) {
        throw new Error(`Failed to fetch style ${styleId} details: ${styleResponse.status}`);
      }

      const styleData = await styleResponse.json();
      // Assuming the styleData contains color information directly for simplicity
      // The actual structure may vary and you might need to navigate through the response
      const { name, description, type, color } = styleData.meta.style;
      const hex = rgbToHex(color.r, color.g, color.b);
      const rgb = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;

      return { name, description, type, hex, rgb };
    }));

    console.log("Style details:", styleDetails);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Styles and color values fetched successfully", styles: styleDetails })
    };
  } catch (error) {
    console.error("Error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Internal Server Error", error: error.message })
    };
  }
};

// Helper function to convert color values from float to hex
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join('');
}
