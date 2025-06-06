const API_BASE_URL = 'http://localhost:3060';
const ctx = document.getElementById('rainfallChart').getContext('2d');
let chart = null;

// --- Funções Auxiliares para o Gráfico ---

function formatLabel(dateString, period) {
    if (!dateString) return '';

    // Formata o rótulo para a visão geral por mês (ex: "Jun/25")
    if (period === 'month_overview') {
        const safeDate = new Date(dateString + '-02'); // Adiciona um dia para criar data válida
        const monthName = safeDate.toLocaleString('pt-BR', { month: 'short' });
        const year = safeDate.getFullYear().toString().slice(-2);
        // Retorna com a primeira letra maiúscula
        return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}/${year}`;
    }
    
    // Formata o rótulo para a visão de hoje (ex: "15:43")
    const safeDate = new Date(dateString); // Formato ISO já é seguro aqui
    if (isNaN(safeDate.getTime())) return 'Data Inválida';

    return safeDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function renderChart(labels, values, chartType, chartLabel) {
    if (chart) chart.destroy(); // Sempre destrói o gráfico antigo

    chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels,
            datasets: [{
                label: chartLabel,
                data: values,
                backgroundColor: 'rgba(13, 110, 253, 0.5)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 2,
                tension: 0.1 // Para o gráfico de linha
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Volume de Chuva (mm)' } } },
            plugins: { legend: { position: 'top' } }
        }
    });
}

// --- Função Principal para Carregar os Dados ---

async function loadChartData(period, buttonElement) {
    setActiveButton(buttonElement);

    let url = '';
    let chartType = 'bar';
    let chartLabel = '';
    let labels = [];
    let values = [];

    if (period === 'month_overview') {
        url = `${API_BASE_URL}/data/overview/monthly`;
        chartType = 'bar';
        chartLabel = 'Chuva total por mês (mm)';
    } else { // 'today'
        url = `${API_BASE_URL}/data/today`;
        chartType = 'line';
        chartLabel = 'Chuva (mm por leitura)';
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const data = await response.json();

        if (period === 'month_overview') {
            labels = data.map(item => formatLabel(item.month, period));
            values = data.map(item => item.totalAmount);
        } else { // 'today'
            labels = data.map(item => formatLabel(item.dataRecebida, period));
            values = data.map(item => item.mm_de_chuva);
        }

        renderChart(labels, values, chartType, chartLabel);
    } catch (error) {
        console.error("Erro ao carregar os dados do gráfico:", error);
    }
}

function setActiveButton(button) {
    document.querySelectorAll('.buttons button').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
}

// Quando a página carregar, inicia mostrando a visão geral por mês
window.onload = () => {
    const initialButton = document.getElementById('btn-month-overview');
    loadChartData('month_overview', initialButton);
};