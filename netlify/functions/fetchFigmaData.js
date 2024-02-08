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
    console.log("Styles found in the file:", styles);

    // Fetch node information to extract color fill data
    const nodes = extractNodes(fileData.document);
    console.log("Nodes found in the file:", nodes);

    // Here you can process the styles, nodes, and layers as needed

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Styles, nodes, and layers fetched successfully", styles, nodes })
    };
  } catch (error) {
    console.error("Error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Internal Server Error", error: error.message })
    };
  }
};

// Function to recursively extract nodes from the document
function extractNodes(document) {
  const nodes = [];
  extractNodesRecursive(document, nodes, []);
  return nodes;
}

function extractNodesRecursive(node, nodes, layerNames) {
  if (node.type === 'PAGE') {
    layerNames.push(node.name); // Push the name of the page
  }
  if (node.children) {
    node.children.forEach(child => {
      extractNodesRecursive(child, nodes, [...layerNames]); // Pass a copy of layerNames
    });
  }
  if (node.fills) {
    const fills = node.fills.filter(fill => fill.type === 'SOLID');
    if (fills.length > 0) {
      nodes.push({
        id: node.id,
        layerNames: layerNames, // Add layer names to the node
        fills: fills.map(fill => ({
          color: fill.color
        }))
      });
    }
  }
}
