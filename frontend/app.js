const API_BASE_URL = 'http://localhost:3333'; // A porta do seu servidor
const ctx = document.getElementById('rainfallChart').getContext('2d');
let chart;

// Função para atualizar o botão ativo
function setActiveButton(button) {
    document.querySelectorAll('.buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    if(button) button.classList.add('active');
}

async function loadChartData(period, buttonElement) {
    setActiveButton(buttonElement);
    try {
        const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/data/</span>{period}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // O endpoint 'today' retorna 'value', os outros retornam 'totalValue'
        const labels = data.map(item => new Date(item.date || item.created_at).toLocaleDateString('pt-BR', { hour: period === 'today' ? '2-digit' : undefined, minute: period === 'today' ? '2-digit' : undefined }));
        const values = data.map(item => item.totalValue ?? item.value);

        let chartType = period === 'today' ? 'line' : 'bar';
        let chartLabel = period === 'today' ? 'Volume de Chuva (pontual)' : 'Chuva Acumulada por Dia (mm)';

        if (chart && chart.config.type !== chartType) {
             chart.destroy(); // Destrói o gráfico antigo se o tipo mudar
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
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1.5,
                        tension: 0.1 // Para suavizar a linha
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true, title: { display: true, text: 'Volume (mm)' } } },
                    plugins: { legend: { position: 'top' } }
                }
            });
        }
    } catch (error) {
        console.error("Falha ao carregar dados do gráfico:", error);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpa o canvas em caso de erro
        ctx.fillText("Não foi possível carregar os dados.", 10, 50);
    }
}

// Carrega os dados da semana por padrão ao abrir a página
window.onload = () => {
    const initialButton = document.getElementById('btn-week');
    loadChartData('week', initialButton);
};