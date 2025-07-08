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
        const container = document.createElement('div'); // Create color-container div
        container.classList.add('color-container'); // Add class for container

        const groupNodesBySection = {}; // Object to store nodes grouped by section

        data.nodes.forEach(item => {
            const section = item.layerNames[2]; // Get the third layer name as section

            // Skip nodes inside the "UI Example" frame
            if (section === "UI Example") {
                return;
            }

            // Skip nodes from the 'instruction_text' layer or any frame containing "instruction_text"
            if (section === "instruction_text" || item.layerNames.includes("instruction_text")) {
                return;
            }

            // Skip nodes where section is undefined
            if (section === undefined || section === null) {
                return;
            }

            if (!groupNodesBySection[section]) {
                groupNodesBySection[section] = [];
            }

            groupNodesBySection[section].push(item);
        });

        // Iterate over each section
        Object.keys(groupNodesBySection).forEach(section => {
            const sectionContainer = document.createElement('div');
            sectionContainer.classList.add('color-section'); // Add class for section container
            
            const sectionLabel = document.createElement('div');
            sectionLabel.classList.add('section-label'); // Add class for section label
            sectionLabel.textContent = section.toUpperCase();
            sectionContainer.appendChild(sectionLabel);
            
            const sectionContentContainer = document.createElement('div');
            sectionContentContainer.classList.add('section-container'); // Add class for section content container
            
            groupNodesBySection[section].forEach(item => {
                const boxContainer = document.createElement('div'); // Create color-box-container div
                boxContainer.classList.add('color-box-container'); // Add class for box container

                const swatch = document.createElement('div'); // Create color-swatch div
                const cssColor = rgbaToCss(item.fills[0].color);
                swatch.classList.add('color-swatch'); // Add class for swatch styling
                swatch.style.backgroundColor = cssColor;
                swatch.title = `Color (RGBA): ${cssColor}, Color (Hex): ${rgbaToHex(item.fills[0].color)}`;

                const details = document.createElement('div'); // Create color-swatch-details div
                details.classList.add('color-swatch-details'); // Add class for details styling
                
                const combinedLayerNames = combineLayerNames(item.layerNames); // Combine layer names using the function
                const cleanedDetails = removeWords(`Layer Names: ${combinedLayerNames}, Color (RGBA): ${cssColor}, Color (Hex): ${rgbaToHex(item.fills[0].color)}`);
                
                // Split combined layer names by comma and wrap each in a detail-label div
                const layerNames = combinedLayerNames.split(',');
                layerNames.forEach(name => {
                    const detailLabel = document.createElement('div');
                    detailLabel.classList.add('detail-label');
                    detailLabel.textContent = name.trim();
                    details.appendChild(detailLabel);
                });

                // Add detail-label divs for CSS RGBA value and Hex value
                const cssLabel = document.createElement('div');
                cssLabel.classList.add('detail-label');
                cssLabel.textContent = cssColor;
                details.appendChild(cssLabel);

                const hexLabel = document.createElement('div');
                hexLabel.classList.add('detail-label');
                hexLabel.textContent = rgbaToHex(item.fills[0].color);
                details.appendChild(hexLabel);

                boxContainer.appendChild(swatch); // Append swatch to box container
                boxContainer.appendChild(details); // Append details to box container

                sectionContentContainer.appendChild(boxContainer); // Append box container to section content container
            });

            sectionContainer.appendChild(sectionContentContainer); // Append section content container to section container
            container.appendChild(sectionContainer); // Append section container to color container
        });

        dataContainer.appendChild(container); // Append color container to data container
    })
    .catch(error => console.error('Error fetching data:', error));
