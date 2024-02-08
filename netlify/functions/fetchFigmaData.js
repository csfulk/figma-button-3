// Use dotenv for loading environment variables
require('dotenv').config();

exports.handler = async (event, context) => {
  const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
  cconst figmaFileId = 'bZm0V473X3N2qB1nw0yaGg'; // Ensure this ID is correct and intended for testing

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
    console.log("Styles found in the file:", styles);

    // Here you can process the styles as needed

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Styles fetched successfully", styles })
    };
  } catch (error) {
    console.error("Error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Internal Server Error", error: error.message })
    };
  }
};
