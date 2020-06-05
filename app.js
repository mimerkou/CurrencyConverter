const fromInput = document.querySelector('[name="from-amount"]');
const fromSelect = document.querySelector('[name="from-currency"]');
const toSelect = document.querySelector('[name="to-currency"]');
const toEl = document.querySelector('.to-amount');
const form = document.querySelector('.container form');
const infoEl = document.querySelector('.info');

const endpoint = `https://api.exchangeratesapi.io/latest`;
const ratesByBase = {};

const currencies = {
    USD: 'United States Dollar',
    AUD: 'Australian Dollar',
    BGN: 'Bulgarian Lev',
    BRL: 'Brazilian Real',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    CZK: 'Czech Republic Koruna',
    DKK: 'Danish Krone',
    GBP: 'British Pound Sterling',
    HKD: 'Hong Kong Dollar',
    HRK: 'Croatian Kuna',
    HUF: 'Hungarian Forint',
    IDR: 'Indonesian Rupiah',
    ILS: 'Israeli New Sheqel',
    INR: 'Indian Rupee',
    JPY: 'Japanese Yen',
    KRW: 'South Korean Won',
    MXN: 'Mexican Peso',
    MYR: 'Malaysian Ringgit',
    NOK: 'Norwegian Krone',
    NZD: 'New Zealand Dollar',
    PHP: 'Philippine Peso',
    PLN: 'Polish Zloty',
    RON: 'Romanian Leu',
    RUB: 'Russian Ruble',
    SEK: 'Swedish Krona',
    SGD: 'Singapore Dollar',
    THB: 'Thai Baht',
    TRY: 'Turkish Lira',
    ZAR: 'South African Rand',
    EUR: 'Euro',
};

function generateOptions(options) {
    return Object.entries(options)
        .map(([currencyCode, currencyName]) => `<option value="${currencyCode}">${currencyCode} - ${currencyName}</option>`)
        .join('');
}

async function fetchRates(base = 'EUR') {
    const response = await fetch(`${endpoint}?base=${base}`);
    const data = await response.json();
    return data;
}

async function convert(amount, from, to) {
    // first check if we even have the rates to convert from that currency
    if (!ratesByBase[from]) {
        console.log(`We don't have ${from} to convert to ${to}. So let's get it!`);
    
        const rates = await fetchRates(from);
        console.log(rates);
    
        // store the rates for next time
        ratesByBase[from] = rates;
    }

    // convert the amount that it was passed in
    const rate = ratesByBase[from].rates[to];
    const convertedAmount = rate * amount;
    console.log(`${amount} ${from} is ${convertedAmount} in ${to}`);

    return convertedAmount;
}

function formatCurrency(amount, currency) {
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
}

async function handleInput(e) {
    const rawAmount = await convert(
      fromInput.value,
      fromSelect.value,
      toSelect.value
    );
    toEl.textContent = formatCurrency(rawAmount, toSelect.value);
}

const optionsHTML = generateOptions(currencies);

// on page load we can populate the options elements
fromSelect.innerHTML = optionsHTML;
toSelect.innerHTML = optionsHTML;

form.addEventListener('input', handleInput);
