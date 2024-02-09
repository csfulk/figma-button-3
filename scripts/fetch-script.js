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
    if (layerNames.includes("mode")) {
        const lastIndex = layerNames.length - 1;
        return `${layerNames[lastIndex - 1]}-${layerNames[lastIndex]}`;
    } else if (layerNames.includes("interface")) {
        return layerNames.slice(3).join('-');
    } else if (layerNames.includes("editorial")) {
        return layerNames.slice(2).join('-');
    } else {
        return layerNames.join('-');
    }
}

// Function to remove specified words from a string
function removeWords(str) {
    return str.replace(/Layer Names:|Color \(RGBA\):|Color \(Hex\):/g, '').trim();
}

// Fetch data from the serverless function
fetch('/.netlify/functions/fetchFigmaData')
    .then(response => response.json())
    .then(data => {
        // Parse and display the data
        const dataContainer = document.getElementById('dataContainer');

        // Create color-container div
        const container = document.createElement('div');
        container.classList.add('color-container'); // Add class for container

        // Group data by category: mode, interface, editorial
        const categories = {
            mode: [],
            interface: [],
            editorial: [],
        };

        data.nodes.forEach(item => {
            const combinedLayerNames = combineLayerNames(item.layerNames);
            if (combinedLayerNames.includes("mode")) {
                categories.mode.push(item);
            } else if (combinedLayerNames.includes("interface")) {
                categories.interface.push(item);
            } else if (combinedLayerNames.includes("editorial")) {
                categories.editorial.push(item);
            }
        });

        // Create sections for each category
        for (const [category, items] of Object.entries(categories)) {
            const sectionContainer = document.createElement('div');
            sectionContainer.classList.add('color-section'); // Add class for section container

            // Create section label
            const sectionLabel = document.createElement('div');
            sectionLabel.classList.add('section-label'); // Add class for section label
            sectionLabel.textContent = category.toUpperCase(); // Set label text to uppercase category name
            sectionContainer.appendChild(sectionLabel);

            items.forEach(item => {
                const boxContainer = document.createElement('div'); // Create color-box-container div
                boxContainer.classList.add('color-box-container'); // Add class for box container

                const swatch = document.createElement('div'); // Create color-swatch div
                const cssColor = rgbaToCss(item.fills[0].color);
                swatch.classList.add('color-swatch'); // Add class for swatch styling
                swatch.style.backgroundColor = cssColor;
                swatch.title = `Color (RGBA): ${cssColor}, Color (Hex): ${rgbaToHex(item.fills[0].color)}`;

                const details = document.createElement('div'); // Create color-swatch-details div
                details.classList.add('color-swatch-details'); // Add class for details styling

                const cleanedDetails = removeWords(`Layer Names: ${combineLayerNames(item.layerNames)}, Color (RGBA): ${cssColor}, Color (Hex): ${rgbaToHex(item.fills[0].color)}`);

                // Split combined layer names by comma and wrap each in a detail-label div
                const layerNames = cleanedDetails.split(',');
                layerNames.forEach(name => {
                    const detailLabel = document.createElement('div');
                    detailLabel.classList.add('detail-label');
                    detailLabel.textContent = name.trim();
                    details.appendChild(detailLabel);
                });

                boxContainer.appendChild(swatch); // Append swatch to box container
                boxContainer.appendChild(details); // Append details to box container

                sectionContainer.appendChild(boxContainer); // Append box container to section container
            });

            container.appendChild(sectionContainer); // Append section container to color container
        }

        dataContainer.appendChild(container); // Append color container to data container
    })
    .catch(error => console.error('Error fetching data:', error));
