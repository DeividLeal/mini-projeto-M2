// Função para formatar a data
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Função para formatar o telefone
function formatarTelefone(telefone) {
    const regex = /^(\d{2})(\d{5})(\d{4})$/;
    const match = telefone.match(regex);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return telefone;
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

// Classe Consulta para representar cada consulta
class Consulta {
    constructor(nome, telefone, data, hora, tipoMassagem) {
        this.nome = nome;
        this.telefone = telefone;
        this.data = data;
        this.hora = hora;
        this.tipoMassagem = tipoMassagem;
    }
}

// Classe Agenda para gerenciar as consultas
class Agenda {
    constructor() {
        this.consultas = JSON.parse(localStorage.getItem('consultas')) || [];
        this.form = document.getElementById('appointmentForm');
        this.appointmentList = document.getElementById('appointmentList');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.adicionarConsulta(e));
        document.addEventListener('DOMContentLoaded', () => this.criarHorariosEspecificos());
        this.renderConsultas();
    }

    salvarConsultas() {
        localStorage.setItem('consultas', JSON.stringify(this.consultas));
    }

    renderConsultas() {
        this.appointmentList.innerHTML = '';
        this.consultas.forEach((consulta, index) => {
            const li = document.createElement('li');
            li.className = 'appointment-item';
            li.innerHTML = `
                <div class="appointment-details">
                    <p><strong>Nome:</strong> ${consulta.nome}</p>
                    <p><strong>Telefone:</strong> ${formatarTelefone(consulta.telefone)}</p>
                    <p><strong>Data:</strong> ${formatarData(consulta.data)}</p>
                    <p><strong>Hora:</strong> ${consulta.hora}</p>
                    <p><strong>Tipo de Massagem:</strong> ${traduzirTipoMassagem(consulta.tipoMassagem)}</p>
                </div>
                <div class="appointment-actions">
                    <button class="buttonEdit" onclick="agenda.editarConsulta(${index}, () => agenda.renderConsultas())">Editar</button>
                    <button class="buttonDelete" onclick="agenda.excluirConsulta(${index}, () => agenda.renderConsultas())">Excluir</button>
                </div>
            `;
            this.appointmentList.appendChild(li);
        });
    }

    adicionarConsulta(e) {
        e.preventDefault();

        const nome = document.getElementById('clientName').value;
        const telefone = document.getElementById('clientPhone').value;
        const data = document.getElementById('appointmentDate').value;
        const hora = document.getElementById('appointmentTime').value;
        const tipoMassagem = document.getElementById('massageType').value;

        const dataConsulta = new Date(data);
        const dataAtual = new Date();

        if (dataConsulta.getMonth() !== dataAtual.getMonth() || dataConsulta.getFullYear() !== dataAtual.getFullYear()) {
            alert('Você só pode marcar consultas para o mês atual.');
            return;
        }

        const [horaConsulta, minutosConsulta] = hora.split(':').map(Number);
        if (horaConsulta < 8 || horaConsulta > 18 || (horaConsulta === 18 && minutosConsulta > 0)) {
            alert('Você só pode marcar consultas no horário comercial das 8h às 18h.');
            return;
        }

        const novaConsulta = new Consulta(nome, telefone, data, hora, tipoMassagem);
        this.consultas.push(novaConsulta);

        this.salvarConsultas();
        this.renderConsultas();
        this.form.reset();
    }

    editarConsulta(index, callback) {
        const consulta = this.consultas[index];

        document.getElementById('clientName').value = consulta.nome;
        document.getElementById('clientPhone').value = consulta.telefone;
        document.getElementById('appointmentDate').value = consulta.data;
        document.getElementById('appointmentTime').value = consulta.hora;
        document.getElementById('massageType').value = consulta.tipoMassagem;

        this.consultas.splice(index, 1);
        this.salvarConsultas();

        if (callback) callback();
    }

    excluirConsulta(index, callback) {
        if (confirm('Você tem certeza que deseja excluir esta consulta?')) {
            this.consultas.splice(index, 1);
            this.salvarConsultas();
            if (callback) callback();
        }
    }

    criarHorariosEspecificos() {
        const horarios = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
        const datalistHora = document.getElementById('horariosDatalist');

        horarios.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario;
            datalistHora.appendChild(option);
        });
    }
}

// Instanciar a agenda
const agenda = new Agenda();
