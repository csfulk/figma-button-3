// script.js

// Fetch data from the serverless function
fetch('/.netlify/functions/fetchFigmaData')
  .then(response => response.json())
  .then(data => {
    // Parse and display the data
    const dataContainer = document.getElementById('dataContainer');
    data.nodes.forEach(item => {
      const paragraph = document.createElement('p');
      paragraph.textContent = `ID: ${item.id}, Layer Names: ${item.layerNames.join(', ')}, Color: rgba(${item.fills[0].color.r * 255}, ${item.fills[0].color.g * 255}, ${item.fills[0].color.b * 255}, ${item.fills[0].color.a})`;
      dataContainer.appendChild(paragraph);
    });
  })
  .catch(error => console.error('Error fetching data:', error));
