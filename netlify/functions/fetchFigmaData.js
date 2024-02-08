// Use dotenv for loading environment variables
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

    // Check if styles exist in the file data
    if (!fileData.styles) {
      throw new Error('No styles found in the file data');
    }

    const styles = fileData.styles;

    // Extract color values from styles and create a new object with style information including RGBA color
    const stylesWithColor = {};
    for (const styleId of Object.keys(styles)) {
      const style = styles[styleId];
      if (style.type === 'FILL') {
        const color = {
          r: style.color.r,
          g: style.color.g,
          b: style.color.b,
          a: style.color.a
        };
        stylesWithColor[styleId] = {
          name: style.name,
          styleType: style.styleType,
          remote: style.remote,
          description: style.description,
          color: color // Include color information
        };
      }
    }

    console.log("Styles with RGBA color fetched successfully:", stylesWithColor);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Styles with RGBA color fetched successfully", styles: stylesWithColor })
    };
  } catch (error) {
    console.error("Error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Internal Server Error", error: error.message })
    };
  }
};
