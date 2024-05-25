document.addEventListener('DOMContentLoaded', function() {
    loadDataAndGenerateImages('gap_up', 'gapUpStocks');
    loadDataAndGenerateImages('gap_down', 'gapDownStocks');
    loadDataAndGenerateImages('meets_criteria', 'ma30StocksContainer');
});

function loadDataAndGenerateImages(stockType, elementId) {
    fetch(`https://deepak789.pythonanywhere.com/api/stocks/${stockType}`)
        .then(response => response.json())
        .then(stocks => {
            const container = document.getElementById(elementId);
            const stockContainer = document.createElement('div');
            stockContainer.className = 'stock-container';
            container.appendChild(stockContainer);

            if (stocks.length === 0) {
                stockContainer.innerHTML = '<p>No data available.</p>';
            } else {
                stocks.forEach(stock => {
                    const stockDiv = document.createElement('div');
                    stockDiv.className = 'stock-item';
                    generateImage(stock, () => {
                        const imageUrl = `https://deepak789.pythonanywhere.com/static/${stock}_plot.png`;
                        stockDiv.innerHTML = `
                            <h4>${stock}</h4>
                            <a href="${imageUrl}" target="_blank">
                                <img src="${imageUrl}" alt="Chart for ${stock}" onError="this.src='https://deepak789.pythonanywhere.com/static/placeholder.png';">
                            </a>
                        `;
                        stockContainer.appendChild(stockDiv);
                    });
                });
            }
            hideLoader();
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
            container.innerHTML = `<p>Error loading data: ${error.message}</p>`;
            hideLoader();
        });
}

function generateImage(stock, callback) {
    fetch(`https://deepak789.pythonanywhere.com/plot/${stock}`)
        .then(response => {
            if (response.ok) {
                console.log(`Image generated for ${stock}`);
                callback();
            } else {
                console.log(`Failed to generate image for ${stock}`);
            }
        })
        .catch(error => {
            console.error(`Error generating image for ${stock}:`, error);
        });
}
