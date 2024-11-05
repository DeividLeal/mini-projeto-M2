// Classe Consulta para representar cada consulta
class Consulta {
    constructor(nome, telefone, data, tipoMassagem) {
        this.nome = nome;
        this.telefone = telefone;
        this.data = data;
        this.tipoMassagem = tipoMassagem;
    }
}

// Função para traduzir o tipo de massagem
function traduzirTipoMassagem(tipo) {
    const traducoes = {
        'relaxing': 'Relaxante',
        'therapeutic': 'Terapêutica',
        'sports': 'Esportiva'
    };
    return traducoes[tipo] || tipo;
}

// Array para armazenar as consultas
let consultas = JSON.parse(localStorage.getItem('consultas')) || [];

// Seleção de elementos
const form = document.getElementById('appointmentForm');
const appointmentList = document.getElementById('appointmentList');

// Função para renderizar a lista de consultas
function renderConsultas() {
    appointmentList.innerHTML = '';

    consultas.forEach((consulta, index) => {
        const li = document.createElement('li');
        li.className = 'appointment-item';
        li.innerHTML = `
            <div class="appointment-details">
                <p><strong>Nome:</strong> ${consulta.nome}</p>
                <p><strong>Telefone:</strong> ${consulta.telefone}</p>
                <p><strong>Data:</strong> ${consulta.data}</p>
                <p><strong>Tipo de Massagem:</strong> ${traduzirTipoMassagem(consulta.tipoMassagem)}</p>
            </div>
            <div class="appointment-actions">
                <button class="buttonEdit" onclick="editarConsulta(${index}, renderConsultas)">Editar</button>
                <button class="buttonDelete" onclick="excluirConsulta(${index}, renderConsultas)">Excluir</button>
            </div>
        `;
        appointmentList.appendChild(li);
    });
}

// Função para salvar consultas no local storage
function salvarConsultas() {
    localStorage.setItem('consultas', JSON.stringify(consultas));
}

// Função para adicionar uma nova consulta
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('clientName').value;
    const telefone = document.getElementById('clientPhone').value;
    const data = document.getElementById('appointmentDate').value;
    const tipoMassagem = document.getElementById('massageType').value;

    const dataConsulta = new Date(data);
    const dataAtual = new Date();

    if (dataConsulta.getMonth() !== dataAtual.getMonth() || dataConsulta.getFullYear() !== dataAtual.getFullYear()) {
        alert('Você só pode marcar consultas para o mês atual.');
        return;
    }

    const novaConsulta = new Consulta(nome, telefone, data, tipoMassagem);
    consultas.push(novaConsulta);

    salvarConsultas();
    renderConsultas();
    form.reset();
});

// Função para editar uma consulta com callback
function editarConsulta(index, callback) {
    const consulta = consultas[index];

    document.getElementById('clientName').value = consulta.nome;
    document.getElementById('clientPhone').value = consulta.telefone;
    document.getElementById('appointmentDate').value = consulta.data;
    document.getElementById('massageType').value = consulta.tipoMassagem;

    consultas.splice(index, 1);

    salvarConsultas();

    // Executa o callback após a edição
    if (callback) callback();
}

// Função para excluir uma consulta com callback
function excluirConsulta(index, callback) {
    if (confirm('Você tem certeza que deseja excluir esta consulta?')) {
        consultas.splice(index, 1);
        salvarConsultas();
        if (callback) callback();
    }
}

// Renderizar as consultas iniciais (caso existam)
renderConsultas();
