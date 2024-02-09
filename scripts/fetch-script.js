// Fetch data from the serverless function
fetch('/.netlify/functions/fetchFigmaData')
    .then(response => response.json())
    .then(data => {
        // Parse and display the data
        const dataContainer = document.getElementById('dataContainer');
        const container = document.createElement('div'); // Create color-container div
        container.classList.add('color-container'); // Add class for container

        data.nodes.forEach(item => {
            const { fills, layerNames } = item;
            const cssColor = rgbaToCss(fills[0].color);
            const combinedLayerNames = combineLayerNames(layerNames);
            const cleanedDetails = removeWords(`Layer Names: ${combinedLayerNames}, Color (RGBA): ${cssColor}, Color (Hex): ${rgbaToHex(fills[0].color)}`);
            
            const boxContainer = document.createElement('div'); // Create color-box-container div
            boxContainer.classList.add('color-box-container'); // Add class for box container

            const swatch = document.createElement('div'); // Create color-swatch div
            swatch.classList.add('color-swatch'); // Add class for swatch styling
            swatch.style.backgroundColor = cssColor;
            swatch.title = `Color (RGBA): ${cssColor}, Color (Hex): ${rgbaToHex(fills[0].color)}`;

            const details = document.createElement('div'); // Create color-swatch-details div
            details.classList.add('color-swatch-details'); // Add class for details styling

            // Split combined layer names by comma and wrap each in a detail-label div
            combinedLayerNames.split(',').forEach(name => {
                const detailLabel = document.createElement('div');
                detailLabel.classList.add('detail-label');
                detailLabel.textContent = name.trim();
                details.appendChild(detailLabel);
            });

            // Add detail-label divs for CSS RGBA value and Hex value
            ['RGBA', 'Hex'].forEach(label => {
                const value = label === 'RGBA' ? cssColor : rgbaToHex(fills[0].color);
                const labelElement = document.createElement('div');
                labelElement.classList.add('detail-label');
                labelElement.textContent = `${label}: ${value}`;
                details.appendChild(labelElement);
            });

            boxContainer.appendChild(swatch); // Append swatch to box container
            boxContainer.appendChild(details); // Append details to box container

            container.appendChild(boxContainer); // Append box container to color container
        });

        dataContainer.appendChild(container); // Append color container to data container
    })
    .catch(error => console.error('Error fetching data:', error));
