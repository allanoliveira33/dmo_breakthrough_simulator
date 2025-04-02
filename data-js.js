// Status values from the provided table
const statusValues = {
    positives: {
        "HP": [
            [0, 0], [0, 0], [0, 0], [0, 0], [50, 0], 
            [100, 0], [200, 0], [300, 0], [400, 500], [500, 600]
        ],
        "DS": [
            [0, 0], [0, 0], [0, 0], [0, 0], [50, 0], 
            [100, 0], [200, 0], [300, 0], [400, 500], [500, 600]
        ],
        "AT": [
            [0, 0], [0, 0], [0, 0], [0, 0], [30, 0], 
            [50, 0], [100, 0], [300, 0], [150, 200], [200, 300]
        ],
        "CT": [
            [0, 0], [0, 0], [0, 0], [0, 0], [0.2, 0], 
            [0.3, 0], [0.5, 0], [1.5, 0], [1.0, 0.5], [2.0, 3.0]
        ],
        "DEF": [
            [0, 0], [0, 0], [0, 0], [0, 0], [20, 0], 
            [30, 0], [50, 0], [150, 0], [100, 200], [200, 300]
        ],
        "EV": [
            [0, 0], [0, 0], [0, 0], [0, 0], [0.2, 0], 
            [0.3, 0], [0.5, 0], [1.5, 0], [1.0, 0.5], [2.0, 3.0]
        ],
        "HT": [
            [0, 0], [0, 0], [0, 0], [0, 0], [20, 0], 
            [30, 0], [50, 0], [150, 0], [100, 50], [200, 300]
        ],
        "BL": [
            [0, 0], [0, 0], [0, 0], [0, 0], [0.2, 0], 
            [0.3, 0], [0.5, 0], [1.5, 0], [1.0, 0.5], [2.0, 3.0]
        ],
        "SD-Elemento": [
            [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], 
            [0, 0], [1.0, 0], [1.0, 0], [2.0, 0], [2.0, 1.0]
        ],
        "SD-Atributo": [
            [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], 
            [0, 0], [1.0, 0], [1.0, 0], [2.0, 0], [2.0, 1.0]
        ]
    },
    negatives: {
        "HP": [
            [0, 0], [0, 0], [0, 0], [150, 0], [150, 0], 
            [150, 0], [150, 0], [150, 0], [150, 0], [150, 0]
        ],
        "DS": [
            [0, 0], [0, 0], [0, 0], [150, 0], [150, 0], 
            [150, 0], [150, 0], [150, 0], [150, 0], [150, 0]
        ],
        "AT": [
            [0, 0], [0, 0], [0, 0], [75, 0], [75, 0], 
            [75, 0], [75, 0], [75, 0], [75, 0], [75, 0]
        ],
        "CT": [
            [0, 0], [0, 0], [0, 0], [0.5, 0], [0.5, 0], 
            [0.5, 0], [0.5, 0], [0.5, 0], [0.5, 0], [0.5, 0]
        ],
        "DEF": [
            [0, 0], [0, 0], [0, 0], [50, 0], [50, 0], 
            [50, 0], [50, 0], [50, 0], [50, 0], [50, 0]
        ],
        "EV": [
            [0, 0], [0, 0], [0, 0], [0.5, 0], [0.5, 0], 
            [0.5, 0], [0.5, 0], [0.5, 0], [0.5, 0], [0.5, 0]
        ],
        "HT": [
            [0, 0], [0, 0], [0, 0], [50, 0], [50, 0], 
            [50, 0], [50, 0], [50, 0], [50, 0], [50, 0]
        ],
        "BL": [
            [0, 0], [0, 0], [0, 0], [0.5, 0], [0.5, 0], 
            [0.5, 0], [0.5, 0], [0.5, 0], [0.5, 0], [0.5, 0]
        ],
        "SD-Elemento": [
            [0, 0], [0, 0], [0, 0], [1.0, 0], [1.0, 0], 
            [1.0, 0], [1.0, 0], [1.0, 0], [1.0, 0], [1.0, 0]
        ],
        "SD-Atributo": [
            [0, 0], [0, 0], [0, 0], [1.0, 0], [1.0, 0], 
            [1.0, 0], [1.0, 0], [1.0, 0], [1.0, 0], [1.0, 0]
        ]
    }
};

// Total maximum values for each status based on table
const statusTotals = {
    "HP": 2650,
    "DS": 2650,
    "AT": 1330,
    "CT": 9.0,
    "DEF": 1050,
    "EV": 9.0,
    "HT": 900,
    "BL": 9.0,
    "SD-Elemento": 7.0,
    "SD-Atributo": 7.0
};

// Negative totals
const negativeStatusTotals = {
    "HP": 1050,
    "DS": 1050,
    "AT": 525,
    "CT": 3.5,
    "DEF": 350,
    "EV": 3.5,
    "HT": 350,
    "BL": 3.5,
    "SD-Elemento": 7.0,
    "SD-Atributo": 7.0
};

// Success probability tiers
const probabilityTiers = [
    { total: 75, simple: 59, double: 15, triple: 1 },
    { total: 65, simple: 54.2, double: 10, triple: 0.8 },
    { total: 55, simple: 49.4, double: 5, triple: 0.6 },
    { total: 45, simple: 41.6, double: 3, triple: 0.4 },
    { total: 35, simple: 32.8, double: 2, triple: 0.2 },
    { total: 25, simple: 23.9, double: 1, triple: 0.1 }
];
