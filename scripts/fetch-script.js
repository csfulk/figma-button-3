// fetch-script.js

// Fetch data from the serverless function
fetch('/.netlify/functions/fetchFigmaData')
  .then(response => response.json())
  .then(data => {
    // Parse and display the data
    const dataContainer = document.getElementById('dataContainer');
    data.nodes.forEach(item => {
      const divContainer = document.createElement('div');
      divContainer.classList.add('color-box-container');

      const divColor = document.createElement('div');
      divColor.classList.add('color-box');
      divColor.style.backgroundColor = rgbaToCss(item.fills[0].color);

      const divInfo = document.createElement('div');
      divInfo.classList.add('color-info');
      divInfo.innerHTML = `
        <p>Layer Names: ${item.layerNames.join(', ')}</p>
        <p>Color (RGBA): ${rgbaToCss(item.fills[0].color)}</p>
        <p>Color (Hex): ${rgbaToHex(item.fills[0].color)}</p>
      `;

      divContainer.appendChild(divColor);
      divContainer.appendChild(divInfo);
      dataContainer.appendChild(divContainer);
    });
  })
  .catch(error => console.error('Error fetching data:', error));
