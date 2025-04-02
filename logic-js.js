// Game state
function adicionarSufixoAosDuplicados(array) {
    const contagem = {};
    const resultado = [];

    for (const item of array) {
        // Verifica se o item já existe no objeto de contagem
        if (contagem[item]) {
        // Incrementa a contagem
        contagem[item]++;
        // Adiciona o item com o sufixo numérico
        resultado.push(`${item}-${contagem[item]}`);
        } else {
        // Inicializa a contagem para este item
        contagem[item] = 1;
        // Adiciona o item sem modificação
        resultado.push(item);
        }
    }

    return resultado;
}

let positiveStatsCreated = {}
let negativeStatsCreated = {}

let gameState = {
    attemptsLeft: 40,
    currentProbabilityTier: 0, // Index of the current tier in probabilityTiers
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    gameStarted: false,
    positiveStats: [],
    negativeStats: [],
    statusProgress: {}, // Track progress for each status line
    slotStatus: {}, // Track status of each slot (success, fail or empty)
};

// Initialize game elements
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startGame').addEventListener('click', startGame);
    document.getElementById('resetGame').addEventListener('click', resetGame);
    updateSuccessChanceDisplay();
});

function startGame() {
    gameState.gameStarted = true;
    document.getElementById('startGame').disabled = true;
    document.getElementById('resetGame').disabled = false;
    
    // Disable selection inputs
    document.querySelectorAll('select').forEach(select => {
        select.disabled = true;
    });
    
    // Get selected status types
    let positiveStats = [
        document.getElementById('positive1').value,
        document.getElementById('positive2').value,
        document.getElementById('positive3').value
    ];

    let negativeStats = [
        document.getElementById('negative1').value,
        document.getElementById('negative2').value
    ];

    gameState.positiveStats = positiveStats;
    gameState.negativeStats = negativeStats;
    
    // Initialize status progress and slot status
    [...positiveStats, ...negativeStats].forEach(stat => {
        gameState.slotStatus[stat] = Array(10).fill().map(() => Array(2).fill('empty'));
    });
    
    // Generate tables
    generatePositiveTable(positiveStats);
    generateNegativeTable(negativeStats);
    
    updateUI();
}

function resetGame() {
    gameState = {
        attemptsLeft: 40,
        currentProbabilityTier: 0,
        consecutiveSuccesses: 0,
        consecutiveFailures: 0,
        gameStarted: false,
        positiveStats: [],
        negativeStats: [],
        statusProgress: {},
        slotStatus: {},
    };

    positiveStatsCreated = {}
    negativeStatsCreated = {}
    
    document.getElementById('startGame').disabled = false;
    document.getElementById('resetGame').disabled = true;
    
    // Enable selection inputs
    document.querySelectorAll('select').forEach(select => {
        select.disabled = false;
    });
    
    // Clear tables
    document.getElementById('positive-table').querySelector('tbody').innerHTML = '';
    document.getElementById('negative-table').querySelector('tbody').innerHTML = '';
    
    updateUI();
}

function generatePositiveTable(stats) {
    const tableBody = document.getElementById('positive-table').querySelector('tbody');
    tableBody.innerHTML = '';
    
    stats.forEach(stat => {
        const row = document.createElement('tr');
        
        positiveStatsCreated[stat] = (positiveStatsCreated[stat] || 0) + 1;

        const rowId = `${stat}-${positiveStatsCreated[stat]}`;

        // Status name cell
        const nameCell = document.createElement('td');
        nameCell.className = 'status-name';
        nameCell.textContent = stat;
        row.appendChild(nameCell);
        
        // Status slots
        for (let i = 0; i < 10; i++) {
            // Basic slot
            const basicCell = document.createElement('td');
            basicCell.className = 'slot positive';
            basicCell.dataset.stat = stat;
            basicCell.dataset.level = i;
            basicCell.dataset.type = 'basic';
            basicCell.dataset.rowId = rowId;
            
            const basicValue = statusValues.positives[stat][i][0];
            const bonusValue = statusValues.positives[stat][i][1];
            if (typeof basicValue === 'number') {
                if (Number.isInteger(basicValue) || basicValue === 0) {
                    basicCell.innerHTML = `<span class="slot-value">${basicValue+bonusValue}</span>`;
                } else {
                    basicCell.innerHTML = `<span class="slot-value">${(basicValue+bonusValue).toFixed(1)}%</span>`;
                }
            }
            
            // Only first slot is clickable initially
            if (i > 0) {
                basicCell.classList.add('disabled');
            } else {
                basicCell.addEventListener('click', () => attemptUpgrade(stat, i, 'basic', 'positive', rowId));
            }
            
            row.appendChild(basicCell);
            
        }
        
        // Total column
        const totalCell = document.createElement('td');
        totalCell.className = 'total-column';
        totalCell.textContent = '0 / ' + statusTotals[stat];
        totalCell.id = `total-${rowId}`;
        row.appendChild(totalCell);
        
        tableBody.appendChild(row);
    });
}

function generateNegativeTable(stats) {
    const tableBody = document.getElementById('negative-table').querySelector('tbody');
    tableBody.innerHTML = '';
    
    stats.forEach(stat => {
        const row = document.createElement('tr');
        
        positiveStatsCreated[stat] = (positiveStatsCreated[stat] || 0) + 1

        const rowId = `${stat}-${positiveStatsCreated[stat]}`

        // Status name cell
        const nameCell = document.createElement('td');
        nameCell.className = 'status-name';
        nameCell.textContent = stat;
        row.appendChild(nameCell);
        
        // Status slots
        for (let i = 0; i < 10; i++) {
            // Basic slot
            const basicCell = document.createElement('td');
            basicCell.className = 'slot negative';
            basicCell.dataset.stat = stat;
            basicCell.dataset.level = i;
            basicCell.dataset.type = 'basic';
            basicCell.dataset.rowId = rowId;
            
            const basicValue = statusValues.negatives[stat][i][0];
            const bonusValue = statusValues.positives[stat][i][1];
            if (typeof basicValue === 'number') {
                if (Number.isInteger(basicValue) || basicValue === 0) {
                    basicCell.innerHTML = `<span class="slot-value">${basicValue+bonusValue}</span>`;
                } else {
                    basicCell.innerHTML = `<span class="slot-value">${(basicValue+bonusValue).toFixed(1)}%</span>`;
                }
            }
            
            // Only first slot is clickable initially
            if (i > 0) {
                basicCell.classList.add('disabled');
            } else {
                basicCell.addEventListener('click', () => attemptUpgrade(stat, i, 'basic', 'negative', rowId));
            }
            
            row.appendChild(basicCell);
        }
        
        // Total column
        const totalCell = document.createElement('td');
        totalCell.className = 'total-column';
        totalCell.textContent = '0 / ' + (negativeStatusTotals[stat] || 0);
        totalCell.id = `total-${rowId}`;
        row.appendChild(totalCell);
        
        tableBody.appendChild(row);
    });
}

function attemptUpgrade(stat, level, type, statType, rowId) {
    if (!gameState.gameStarted || gameState.attemptsLeft <= 0) {
        return;
    }
    
    // Reduce attempts
    gameState.attemptsLeft--;
    
    // Get current probability tier
    const currentTier = probabilityTiers[gameState.currentProbabilityTier];
    
    // Roll for success
    const roll = Math.random() * 100;
    let successType = 0;
    
    if (roll < currentTier.triple) {
        successType = 3; // Triple success
    } else if (roll < currentTier.triple + currentTier.double) {
        successType = 2; // Double success
    } else if (roll < currentTier.total) {
        successType = 1; // Single success
    } else {
        successType = 0; // Failure
    }
    
    // Handle success or failure
    if (successType > 0) {
        // Success
        handleSuccess(stat, level, type, statType, successType, rowId);
        
        // Update consecutive counts
        gameState.consecutiveSuccesses++;
        gameState.consecutiveFailures = 0;
        
        // Decrease success chance (move to next tier with lower success chance)
        adjustSuccessProbability(true);
    } else {
        // Failure
        handleFailure(stat, level, type, statType, rowId);
        
        // Update consecutive counts
        gameState.consecutiveFailures++;
        gameState.consecutiveSuccesses = 0;
        
        // Increase success chance (move to previous tier with higher success chance)
        adjustSuccessProbability(false);
    }
    
    // Update UI
    updateUI();
}

function handleSuccess(stat, level, type, statType, successType, rowId) {
    // Mark current slot as success
    const slot = document.querySelector(
        `.slot.${statType}[data-stat="${stat}"][data-level="${level}"][data-type="${type}"][data-row-id="${rowId}"]`
    );
    
    if (slot) {
        slot.classList.add('success', 'disabled');
        slot.disabled = true
        slot.parentNode.innerHTML += '';
        gameState.slotStatus[stat][level][0] = 'success';
        
        // Update status progress
        const valueArray = statType === 'positive' ? 
            statusValues.positives[stat][level] : 
            statusValues.negatives[stat][level];
        
        const value = valueArray[0];
        const bonus = valueArray[1];
        gameState.statusProgress[rowId] = (gameState.statusProgress[rowId] || 0) + value + bonus;
        
        // Update total display
        updateTotalDisplay(stat, rowId);
    }
    
    // Handle multiple success (apply success to next slots)
    if (successType > 1) {
        applyAdditionalSuccesses(stat, level, type, statType, successType, rowId);
    } else {
        // Enable next slots
        enableNextSlots(stat, level, type, statType, rowId);
    }
    
}

function handleFailure(stat, level, type, statType, rowId) {
    // Mark current slot as failed
    const slot = document.querySelector(
        `.slot.${statType}[data-stat="${stat}"][data-level="${level}"][data-type="${type}"][data-row-id="${rowId}"]`
    );
    
    if (slot) {
        slot.classList.add('fail', 'disabled');
        slot.disabled = true
        slot.parentNode.innerHTML += '';
        gameState.slotStatus[stat][level][0] = 'fail';
    }
    
    // Enable next slots
    enableNextSlots(stat, level, type, statType, rowId);
}

function applyAdditionalSuccesses(stat, level, type, statType, successCount, rowId) {
    // Get status values reference
    const statusTypeValues = statType === 'positive' ? 
        statusValues.positives : statusValues.negatives;
    
    // Get all available slots for this stat
    const availableSlots = [];
    
    // Then add next levels
    for (let i = level + 1; i < 10; i++) {
        // Add basic slot for next level
        availableSlots.push({
            level: i,
            type: 'basic',
            value: statusTypeValues[stat][i][0] + statusTypeValues[stat][i][1],
            rowId: rowId
        });
    }
    
    // Apply success to next (successCount - 1) slots
    for (let i = 0; i < successCount - 1 && i < availableSlots.length; i++) {
        const nextSlot = availableSlots[i];
        
        // Find the slot element
        const slotElement = document.querySelector(
            `.slot.${statType}[data-stat="${stat}"][data-level="${nextSlot.level}"][data-type="${nextSlot.type}"][data-row-id="${rowId}"]`
        );
        
        if (slotElement) {
            slotElement.classList.add('success', 'disabled');
            slotElement.disabled = true
            slotElement.parentNode.innerHTML += '';
            gameState.slotStatus[stat][nextSlot.level][0] = 'success';
            
            // Update status progress
            gameState.statusProgress[rowId] = (gameState.statusProgress[rowId] || 0) + nextSlot.value;
        }
    }

    enableNextSlots(stat, level + (successCount - 1) , type, statType, rowId);
    
    // Update total display
    updateTotalDisplay(stat, rowId);
}

function enableNextSlots(stat, level, type, statType, rowId) {    
    // Enable the next level's basic slot
    if (level < 9) {
        const nextBasicSlot = document.querySelector(
            `.slot.${statType}[data-stat="${stat}"][data-level="${level + 1}"][data-type=${type}][data-row-id="${rowId}"]`
        );
        
        if (nextBasicSlot) {
            nextBasicSlot.classList.remove('disabled');
            nextBasicSlot.addEventListener('click', () => attemptUpgrade(stat, level + 1, 'basic', statType, rowId));
        }
    }
}

function updateTotalDisplay(stat, rowId) {
    const totalElement = document.getElementById(`total-${rowId}`);
    if (totalElement) {
        const maxValue = stat in statusTotals ? statusTotals[stat] : negativeStatusTotals[stat];
        totalElement.textContent = `${gameState.statusProgress[rowId]} / ${maxValue}`;
    }
}

function adjustSuccessProbability(isSuccess) {
    if (isSuccess) {
        // After success, decrease probability (move to next tier with lower chance)
        gameState.currentProbabilityTier = Math.min(
            probabilityTiers.length - 1,
            gameState.currentProbabilityTier + 1
        );
    } else {
        // After failure, increase probability (move to previous tier with higher chance)
        gameState.currentProbabilityTier = Math.max(
            0,
            gameState.currentProbabilityTier - 1
        );
    }
}

function updateSuccessChanceDisplay() {
    const currentTier = probabilityTiers[gameState.currentProbabilityTier];
    
    document.getElementById('success-chance').textContent = `${currentTier.total}%`;
    document.getElementById('simple-chance').textContent = `${currentTier.simple}%`;
    document.getElementById('double-chance').textContent = `${currentTier.double}%`;
    document.getElementById('triple-chance').textContent = `${currentTier.triple}%`;
}

function updateUI() {
    // Update attempts counter
    document.getElementById('attempts-counter').textContent = `${gameState.attemptsLeft}/40`;
    document.getElementById('attempts-progress').style.width = `${(gameState.attemptsLeft / 40) * 100}%`;
    
    // Update success chance display
    updateSuccessChanceDisplay();
    
    // Gray out all slots if game is over
    if (gameState.attemptsLeft <= 0) {
        document.querySelectorAll('.slot:not(.success):not(.fail)').forEach(slot => {
            slot.classList.add('fail', 'disabled');
        });
    }
}

// Optional: Add automatic recommendation for best next move
function recommendBestMove() {
    if (!gameState.gameStarted || gameState.attemptsLeft <= 0) {
        return null;
    }
    
    // Simple strategy: prioritize unfinished positive stats first
    for (const stat of gameState.positiveStats) {
        // Find first unfinished level
        for (let level = 0; level < 10; level++) {
            // Check basic slot
            if (gameState.slotStatus[stat][level][0] === 'empty') {
                return {
                    stat: stat,
                    level: level,
                    type: 'basic',
                    statType: 'positive'
                };
            }
            
            // Check bonus slot if it has value
            if (statusValues.positives[stat][level][1] > 0 && 
                gameState.slotStatus[stat][level][1] === 'empty' &&
                gameState.slotStatus[stat][level][0] === 'success') {
                return {
                    stat: stat,
                    level: level,
                    type: 'bonus',
                    statType: 'positive'
                };
            }
        }
    }
    
    // Then try negative stats
    for (const stat of gameState.negativeStats) {
        for (let level = 0; level < 10; level++) {
            if (gameState.slotStatus[stat][level][0] === 'empty') {
                return {
                    stat: stat,
                    level: level,
                    type: 'basic',
                    statType: 'negative'
                };
            }
        }
    }
    
    return null;
}

// Auto-play function (for testing or demonstration)
function autoPlay(steps = 1) {
    for (let i = 0; i < steps && gameState.attemptsLeft > 0; i++) {
        const move = recommendBestMove();
        if (move) {
            attemptUpgrade(move.stat, move.level, move.type, move.statType);
        } else {
            break;
        }
    }
}
