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

// Function to combine layer names based on specific keywords
function combineLayerNames(layerNames) {
    for (let i = 0; i < layerNames.length - 1; i++) {
        if (layerNames[i].toLowerCase() === "mode" || layerNames[i].toLowerCase() === "interface") {
            return layerNames.slice(i + 2).join('-');
        }
        if (layerNames[i].toLowerCase() === "editorial") {
            return layerNames.slice(i + 1).join('-');
        }
    }
    return layerNames[layerNames.length - 1];
}

// Fetch data from the serverless function
fetch('/.netlify/functions/fetchFigmaData')
    .then(response => response.json())
    .then(data => {
        // Parse and display the data
        const dataContainer = document.getElementById('dataContainer');
        const container = document.createElement('div'); // Create container
        container.classList.add('color-container'); // Add class for container

        data.nodes.forEach(item => {
            const div = document.createElement('div');
            const cssColor = rgbaToCss(item.fills[0].color);
            const hexColor = rgbaToHex(item.fills[0].color);
            const combinedLayerNames = combineLayerNames(item.layerNames);
            div.classList.add('color-swatch'); // Add class for styling
            div.style.backgroundColor = cssColor;
            div.title = `Color (RGBA): ${cssColor}, Color (Hex): ${hexColor}`;

            // Append text containing the data to the div
            const text = document.createTextNode(`Layer Names: ${combinedLayerNames}, Color (RGBA): ${cssColor}, Color (Hex): ${hexColor}`);
            div.appendChild(text);

            container.appendChild(div); // Append color-swatch div to container
        });

        dataContainer.appendChild(container); // Append container to data container
    })
    .catch(error => console.error('Error fetching data:', error));
