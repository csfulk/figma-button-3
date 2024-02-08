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

    // Check if document node exists
    if (!fileData.document) {
      throw new Error('Document node not found in the file data');
    }

    const documentNode = fileData.document;

    // Find the frame node titled "Color Palette"
    let colorPaletteFrame = null;
    if (documentNode.children) {
      for (const childNode of documentNode.children) {
        if (childNode.type === "CANVAS" && childNode.name === "Color Palette") {
          colorPaletteFrame = childNode;
          break;
        }
      }
    }

    if (!colorPaletteFrame) {
      throw new Error('Frame node "Color Palette" not found');
    }

    // Extract style names and their respective fill colors
    const stylesWithColors = {};
    for (const childNode of colorPaletteFrame.children) {
      if (childNode.type === "RECTANGLE" && childNode.fills) {
        const styleName = childNode.name;
        const fillColor = childNode.fills[0].color;
        const rgbaColor = {
          r: fillColor.r,
          g: fillColor.g,
          b: fillColor.b,
          a: fillColor.a
        };
        stylesWithColors[styleName] = rgbaColor;
      }
    }

    console.log("Style names and their respective fill colors:", stylesWithColors);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Style names and their respective fill colors extracted successfully", stylesWithColors })
    };
  } catch (error) {
    console.error("Error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Internal Server Error", error: error.message })
    };
  }
};
