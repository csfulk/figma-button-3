// fetch-script.js

// Function to convert RGBA color to CSS RGBA format
function rgbaToCss(rgba) {
    return `rgba(${Math.round(rgba.r * 255)}, ${Math.round(rgba.g * 255)}, ${Math.round(rgba.b * 255)}, ${rgba.a})`;
  }
  
  // Function to convert RGBA color to hexadecimal format
  function rgbaToHex(rgba) {
    const r = Math.round(rgba.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(rgba.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(rgba.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  
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
        div.style.backgroundColor = cssColor;
        div.style.width = '80px';
        div.style.height = '80px';
        div.style.margin = '5px';
        div.title = `Color (RGBA): ${cssColor}, Color (Hex): ${hexColor}`;
        
        // Append text containing the data to the div
        const text = document.createTextNode(`Layer Names: ${item.layerNames.join(', ')}, Color (RGBA): ${cssColor}, Color (Hex): ${hexColor}`);
        div.appendChild(text);
        
        dataContainer.appendChild(div);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
  