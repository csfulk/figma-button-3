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
        const container = document.createElement('div'); // Create color-container div
        container.classList.add('color-container'); // Add class for container

        data.nodes.forEach(item => {
            const boxContainer = document.createElement('div'); // Create color-box-container div
            boxContainer.classList.add('color-box-container'); // Add class for box container

            const swatch = document.createElement('div'); // Create color-swatch div
            const cssColor = rgbaToCss(item.fills[0].color);
            swatch.classList.add('color-swatch'); // Add class for swatch styling
            swatch.style.backgroundColor = cssColor;
            swatch.title = `Color (RGBA): ${cssColor}, Color (Hex): ${rgbaToHex(item.fills[0].color)}`;

            const details = document.createElement('div'); // Create color-swatch-details div
            details.classList.add('color-swatch-details'); // Add class for details styling
            details.textContent = `Layer Names: ${item.layerNames.join(', ')}`;

            boxContainer.appendChild(swatch); // Append swatch to box container
            boxContainer.appendChild(details); // Append details to box container

            container.appendChild(boxContainer); // Append box container to color container
        });

        dataContainer.appendChild(container); // Append color container to data container
    })
    .catch(error => console.error('Error fetching data:', error));
