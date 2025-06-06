const API_BASE_URL = 'http://localhost:3060';
const ctx = document.getElementById('rainfallChart').getContext('2d');
let chart;

function setActiveButton(button) {
    document.querySelectorAll('.buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    if (button) {
        button.classList.add('active');
    }
}

async function loadChartData(period, buttonElement) {
    setActiveButton(buttonElement);
    try {
        const response = await fetch(`${API_BASE_URL}/data/${period}`);
        const data = await response.json();

        

        const labels = data.map(item => {
            // Pega a string da data, seja do campo 'date' (agregado) ou 'dataRecebida' (detalhado)
            const dateString = item.date || item.dataRecebida;

            // Se por algum motivo a data não existir, retorna uma string vazia para não quebrar o gráfico
            if (!dateString) { return ''; }

            // Aplica a correção segura para o formato AAAA-MM-DD
            const safeDate = new Date(dateString.replace(/-/g, '/'));
            
            // Se mesmo assim a data for inválida, loga um erro
            if (isNaN(safeDate.getTime())) {
                console.error('Data inválida encontrada:', dateString);
                return 'Data Inválida';
            }

            return period === 'today' 
                ? safeDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
                : safeDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        });

        const values = data.map(item => item.totalAmount ?? item.mm_de_chuva);

        let chartType = period === 'today' ? 'line' : 'bar';
        let chartLabel = `Chuva (${period === 'today' ? 'mm por leitura' : 'mm por dia'})`;

        if (chart && chart.config.type !== chartType) {
            chart.destroy();
            chart = null;
        }

        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = values;
            chart.data.datasets[0].label = chartLabel;
            chart.update();
        } else {
            chart = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: chartLabel,
                        data: values,
                        backgroundColor: 'rgba(13, 110, 253, 0.5)',
                        borderColor: 'rgba(13, 110, 253, 1)',
                        borderWidth: 2,
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Volume de Chuva (mm)'
                            }
                        }
                    },
                    plugins: {
                        legend: { position: 'top' }
                    }
                }
            });
        }
    } catch (error) {
        console.error("Falha ao carregar dados do gráfico:", error);
    }
}

window.onload = () => {
    const initialButton = document.getElementById('btn-week');
    loadChartData('week', initialButton);
};