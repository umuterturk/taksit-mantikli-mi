document.addEventListener('DOMContentLoaded', () => {
    // Default inflation rates
    const defaultYearlyInflation = 61.78; // Example: 120% yearly inflation
    const defaultMonthlyInflation = 3.23;

    // Set initial default values in the form
    document.getElementById('inflationRate').value = defaultYearlyInflation;
    document.getElementById('inflationType').value = 'yearly';

    // Listen for changes in inflation type
    document.getElementById('inflationType').addEventListener('change', function () {
        if (this.value === 'yearly') {
            document.getElementById('inflationRate').value = defaultYearlyInflation;
        } else if (this.value === 'monthly') {
            document.getElementById('inflationRate').value = defaultMonthlyInflation.toFixed(2);
        }
    });

    document.getElementById('calcForm').addEventListener('input', handleInput);
});

function handleInput(event) {
    const numInstallments = parseInt(document.getElementById('numInstallments').value) || 0;
    const installmentAmountInput = document.getElementById('installmentAmount');
    const totalInstallmentAmountInput = document.getElementById('totalInstallmentAmount');

    if (event.target.id === 'installmentAmount' && numInstallments) {
        const installmentAmount = parseFloat(installmentAmountInput.value) || 0;
        totalInstallmentAmountInput.value = (installmentAmount * numInstallments).toFixed(2);
    }

    if (event.target.id === 'totalInstallmentAmount' && numInstallments) {
        const totalInstallmentAmount = parseFloat(totalInstallmentAmountInput.value) || 0;
        installmentAmountInput.value = (totalInstallmentAmount / numInstallments).toFixed(2);
    }

    calculate();
}

function calculate() {
    const cashPrice = parseFloat(document.getElementById('cashPrice').value) || 0;
    const numInstallments = parseInt(document.getElementById('numInstallments').value) || 0;
    const installmentAmount = parseFloat(document.getElementById('installmentAmount').value) || 0;
    const inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100 || 0;
    const inflationType = document.getElementById('inflationType').value;

    let adjustedTotal = 0;

    for (let i = 0; i < numInstallments; i++) {
        let inflationAdjustment = 1;
        if (inflationType === 'monthly') {
            inflationAdjustment = Math.pow(1 + inflationRate, i / 12);
        } else if (inflationType === 'yearly') {
            inflationAdjustment = Math.pow(1 + inflationRate, i);
        }
        adjustedTotal += installmentAmount / inflationAdjustment;
    }

    const resultDiv = document.getElementById('result');
    if (adjustedTotal < cashPrice) {
        resultDiv.innerHTML = `Taksit daha avantajlı! <br>Taksitli Gerçek Maliyet: ₺${adjustedTotal.toFixed(2)}.<br> Peşin Maliyet: ₺${cashPrice.toFixed(2)}.`;
    } else {
        resultDiv.innerHTML = `Peşin ödeme daha avantajlı! <br>Taksitli Gerçek Maliyet: ₺${adjustedTotal.toFixed(2)}.<br> Peşin Maliyet: ₺${cashPrice.toFixed(2)}.`;
    }
}
