document.addEventListener('DOMContentLoaded', () => {
    // Default inflation rates
    const defaultYearlyInflation = 61.78; // Example: 120% yearly inflation
    const defaultMonthlyInflation = 3.23;

    // Set initial default values in the form
    document.getElementById('inflationRate').value = defaultYearlyInflation;
    document.getElementById('inflationType').value = 'yearly';

    // Listen for changes in inflation type
    document.getElementById('inflationType').addEventListener('change', function () {
        calculate(); // Trigger calculation when inflation type changes
    });

    // Listen for changes in inflation rate
    document.getElementById('inflationRate').addEventListener('input', calculate);
    document.getElementById('numInstallments').addEventListener('input', calculate);

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

    if (event.target.id === 'numInstallments') {
        const installmentAmount = parseFloat(installmentAmountInput.value) || 0;
        totalInstallmentAmountInput.value = (installmentAmount * numInstallments).toFixed(2);
    }

    if (event.target.id === 'totalInstallmentAmount' && numInstallments) {
        const totalInstallmentAmount = parseFloat(totalInstallmentAmountInput.value) || 0;
        installmentAmountInput.value = (totalInstallmentAmount / numInstallments).toFixed(2);
    }

    calculate(); // Trigger calculation on other input changes
}

function calculate() {
    const cashPrice = parseFloat(document.getElementById('cashPrice').value) || 0;
    const numInstallments = parseFloat(document.getElementById('numInstallments').value) || 0;
    const installmentAmount = parseFloat(document.getElementById('installmentAmount').value) || 0;
    let monthlyInflationRate = parseFloat(document.getElementById('inflationRate').value) / 100 || 0;
    const inflationType = document.getElementById('inflationType').value;

    if (inflationType === 'yearly') {
        monthlyInflationRate = Math.pow(1.0 + monthlyInflationRate, 1/12);
    } else  {
        monthlyInflationRate = 1.0 + monthlyInflationRate;
    }


    let adjustedTotal = 0;

    let inflationAdjustment = 1;
    for (let i = 0; i < numInstallments; i++) {
        inflationAdjustment *= monthlyInflationRate;
        adjustedTotal += installmentAmount / inflationAdjustment;
    }

    adjustedTotal = installmentAmount * (1 - 1 / (Math.pow(monthlyInflationRate, numInstallments))) / (monthlyInflationRate - 1);

    const resultDiv = document.getElementById('result');
    let pesinReelMaliyet = `Peşin Reel Maliyet: ₺${cashPrice.toFixed(2)}`;
    let taksitliReelMaliyet = `Taksitli Reel Maliyet: ₺${adjustedTotal.toFixed(2)}`;
    let fark = cashPrice - adjustedTotal;
    let farkHtml = `Peşin - Taksitli Reel Farkı: <span style="color: ${fark > 0 ?'green' : 'red'}">₺${fark.toFixed(2)}`;
    if (adjustedTotal < cashPrice) {
        resultDiv.innerHTML = `Taksit daha avantajlı! <br>${taksitliReelMaliyet}.<br> ${pesinReelMaliyet} <br> ${farkHtml}.`;
    } else {
        resultDiv.innerHTML = `Peşin ödeme daha avantajlı! <br>${taksitliReelMaliyet}<br>${pesinReelMaliyet} <br> ${farkHtml}.`;
    }
}
