// script.js

// Function to convert RGBA color to CSS RGBA format
function rgbaToCss(rgba) {
    return `rgba(${Math.round(rgba.r * 255)}, ${Math.round(rgba.g * 255)}, ${Math.round(rgba.b * 255)}, ${rgba.a})`;
  }
  
  // Fetch data from the serverless function
  fetch('/.netlify/functions/fetchFigmaData')
    .then(response => response.json())
    .then(data => {
      // Parse and display the data
      const dataContainer = document.getElementById('dataContainer');
      data.nodes.forEach(item => {
        const paragraph = document.createElement('p');
        const cssColor = rgbaToCss(item.fills[0].color);
        paragraph.textContent = `ID: ${item.id}, Layer Names: ${item.layerNames.join(', ')}, Color: ${cssColor}`;
        dataContainer.appendChild(paragraph);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
  