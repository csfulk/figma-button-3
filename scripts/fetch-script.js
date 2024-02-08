// fetch-script.js

// Fetch data from the serverless function
fetch('/.netlify/functions/fetchFigmaData')
  .then(response => response.json())
  .then(data => {
    // Parse and display the data
    const dataContainer = document.getElementById('dataContainer');
    data.nodes.forEach(item => {
      const div = document.createElement('div');
      const cssColor = rgbaToCss(item.fills[0].color);
      const hexColor = rgbaToHex(item.fills[0].color);
      div.classList.add('color-box'); // Add class for styling
      div.title = `Color (RGBA): ${cssColor}, Color (Hex): ${hexColor}`;
      
      // Append text containing the data to the div
      const text = document.createTextNode(`Layer Names: ${item.layerNames.join(', ')}, Color (RGBA): ${cssColor}, Color (Hex): ${hexColor}`);
      div.appendChild(text);
      
      dataContainer.appendChild(div);
    });
  })
  .catch(error => console.error('Error fetching data:', error));
