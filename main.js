
document.addEventListener('DOMContentLoaded', function() {
    console.log('vjih');
    
    setupMatrixDisplay();
    
    
});

// disaplyruri
const objects = [
    {
        name: 'LG 49XE',
        categories: ['High Brightening'],
        diagonale: [49],
        width: 32,
        height: 15
    },
    {
        name: 'LG 49VL',
        categories: ['Video Wall'],
        diagonale: [49],
        width: 32,
        height: 15
    },
    {
        name: 'LG 65XE',
        categories: ['High Brightening'],
        diagonale: [65],
        width: 50,
        height: 19
    },
    {
        name: 'LG 55VL',
        categories: ['Video Wall'],
        diagonale: [55],
        width: 34,
        height: 17
    },
    {
        name: 'LG 55UH',
        categories: ['Standard'],
        diagonale: [55],
        width: 34,
        height: 17
    },
    {
        name: 'LG 49UH',
        categories: ['Standard'],
        diagonale: [49],
        width: 32,
        height: 15
    }
];


function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => {
       
        if (name === 'diagonala') return Number(cb.value);
        return cb.value.trim();
    });
}
//algortitn fct de chat gpt
function setupMatrixDisplay() {
    const generateBtn = document.getElementById('generate-btn');
    const matrixContainer = document.getElementById('matrix-container');
    const matrixInfo = document.getElementById('matrix-info');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const latime = parseFloat(document.getElementById('latime').value);
            const inaltime = parseFloat(document.getElementById('inaltime').value);

            // Get selected categories and diagonale
            const selectedCategories = getCheckedValues('categorie').map(v => v.toLowerCase());
            const selectedDiagonale = getCheckedValues('diagonala');

            // Calculate matrix size
            const cols = Math.max(1, Math.floor(latime / 5));
            const rows = Math.max(1, Math.floor(inaltime / 5));

            // Clear previous matrices
            matrixContainer.innerHTML = '';

            // For each combination, generate a matrix if an object matches
            let foundAny = false;
            let matrixCounter = 1;
            selectedCategories.forEach(category => {
                selectedDiagonale.forEach(diagonala => {
                    const matchedObject = objects.find(obj =>
                        obj.categories.some(cat => cat.toLowerCase() === category) &&
                        obj.diagonale.includes(diagonala)
                    );
                    if (matchedObject) {
                        foundAny = true;
                        // Generate a rectangular shape for the object
                        const shape = [];
                        for (let i = 0; i < matchedObject.height; i++) {
                            for (let j = 0; j < matchedObject.width; j++) {
                                shape.push([i, j]);
                            }
                        }
                        // Create a wrapper for info + matrix
                        const wrapper = document.createElement('div');
                        wrapper.className = 'matrix-box';
                        
                        // Add matrix number header
                        const numberHeader = document.createElement('div');
                        numberHeader.className = 'matrix-number';
                        numberHeader.innerHTML = `<span class="matrix-number-badge">Matrix ${matrixCounter}</span>`;
                        
                        // Info
                        const infoDiv = document.createElement('div');
                        infoDiv.innerHTML = `
                            <div>Dimensiuni perete: ${latime} x ${inaltime} (cm)</div>
                           
                            <div>Ecran: <b>${matchedObject.name}</b></div>
                            <div>Numar ecrane: ...</div>
                        `;
                        // Matrix
                        const matrixDiv = document.createElement('div');
                        // Generate and display the matrix, but update info after
                        const { matrice, total } = plaseazaObiecte(rows, cols, shape);
                        displayMatrixOnPage(matrice, matrixDiv);
                        // Update objects placed info
                        infoDiv.querySelector('div:last-child').textContent = `Numar ecrane: ${total}`;
                        // Append
                        wrapper.appendChild(numberHeader);
                        wrapper.appendChild(infoDiv);
                        wrapper.appendChild(matrixDiv);
                        matrixContainer.appendChild(wrapper);
                        matrixCounter++;
                    }
                });
            });

            if (!foundAny) {
                matrixContainer.innerHTML = '<div style="color: white; font-weight: bold;">No matching object for selected options.</div>';
            }
        });
    }
    
    // Set initial placeholder text
    matrixContainer.innerHTML = '<div class="placeholder-text">Introduceti configuratia peretelui</div>';
}


//afisare matrice
function displayMatrixOnPage(matrice, container) {
    if (!container) return;

    container.innerHTML = '';

    const maxDisplayWidth = 700; 
    const maxDisplayHeight = 700; 
    const numRows = matrice.length;
    const numCols = matrice[0]?.length || 1;
    

    const cellWidth = Math.floor(maxDisplayWidth / numCols);
    const cellHeight = Math.floor(maxDisplayHeight / numRows);
    const cellSize = Math.max(2, Math.min(cellWidth, cellHeight)); 

    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix';
    matrixDiv.style.display = 'inline-block';

    matrice.forEach((row, rowIdx) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        rowDiv.style.display = 'flex';

        row.forEach((cell, colIdx) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'matrix-cell';
            cellDiv.style.width = `${cellSize}px`;
            cellDiv.style.height = `${cellSize}px`;
            cellDiv.style.minWidth = `${cellSize}px`;
            cellDiv.style.minHeight = `${cellSize}px`;
            cellDiv.style.maxWidth = `${cellSize}px`;
            cellDiv.style.maxHeight = `${cellSize}px`;
            cellDiv.style.overflow = 'hidden';

            if (cell === 0) {
                cellDiv.classList.add('empty');
                if (cellSize >= 12) {
                    cellDiv.textContent = '.';
                } else {
                    cellDiv.textContent = '';
                }
                cellDiv.title = cell === 0 ? `(${rowIdx+1},${colIdx+1}): .` : '';
            } else {
                cellDiv.classList.add('filled');
                cellDiv.classList.add(`filled-${cell}`);
                
                // Add object number display
                if (cellSize >= 16) {
                    cellDiv.textContent = cell;
                } else if (cellSize >= 12) {
                    cellDiv.textContent = cell;
                } else {
                    cellDiv.textContent = '';
                }
                
                // Add object border styling
                cellDiv.style.border = '2px solid #ffffff';
                cellDiv.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.3)';
                
                cellDiv.title = `Object ${cell} at (${rowIdx+1},${colIdx+1})`;
            }

            // Add visual separation between objects
            if (cell !== 0) {
                // Check if this cell is at the edge of an object
                const isLeftEdge = colIdx === 0 || matrice[rowIdx][colIdx - 1] !== cell;
                const isRightEdge = colIdx === numCols - 1 || matrice[rowIdx][colIdx + 1] !== cell;
                const isTopEdge = rowIdx === 0 || matrice[rowIdx - 1][colIdx] !== cell;
                const isBottomEdge = rowIdx === numRows - 1 || matrice[rowIdx + 1][colIdx] !== cell;
                
                if (isLeftEdge) cellDiv.style.borderLeft = '3px solid #ffffff';
                if (isRightEdge) cellDiv.style.borderRight = '3px solid #ffffff';
                if (isTopEdge) cellDiv.style.borderTop = '3px solid #ffffff';
                if (isBottomEdge) cellDiv.style.borderBottom = '3px solid #ffffff';
            }

            rowDiv.appendChild(cellDiv);
        });

        matrixDiv.appendChild(rowDiv);
    });

    container.appendChild(matrixDiv);
}

function poatePlasa(matrice, forma, i, j) {
    const n = matrice.length;
    const m = matrice[0].length;

    for (const [dx, dy] of forma) {
        const x = i + dx;
        const y = j + dy;
        if (x < 0 || x >= n || y < 0 || y >= m || matrice[x][y] !== 0) {
            return false;
        }
    }
    return true;
}

function plaseazaForma(matrice, forma, i, j, idObiect) {
    for (const [dx, dy] of forma) {
        const x = i + dx;
        const y = j + dy;
        matrice[x][y] = idObiect;
    }
}

function plaseazaObiecte(n, m, forma) {
    const matrice = Array.from({ length: n }, () => Array(m).fill(0));
    let idObiect = 1;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (poatePlasa(matrice, forma, i, j)) {
                plaseazaForma(matrice, forma, i, j, idObiect);
                idObiect++;
            }
        }
    }

    return { matrice, total: idObiect - 1 };
}

function afiseazaMatrice(matrice) {
    for (const row of matrice) {
        console.log(row.map(v => (v === 0 ? "." : v)).join("\t"));
    }
}
