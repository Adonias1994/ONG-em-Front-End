/**
 * =========================================
 * 1. TEMPLATES (Vistas da Aplicação)
 * =========================================
 * Contém o HTML de cada secção que será injetado no DOM.
 */
const Views = {
    home: `
        <section class="card">
            <h2>O Nosso Propósito</h2>
            <img src="multi_midia/imagem1.jpg" alt="Equipa de voluntários da ONG reunida organizando doações.">
            <p>A ONG é uma organização de iniciativa privada que não possui fins lucrativos e atua em prol do interesse público e social, focando no bem-estar coletivo.</p>
        </section>

        <section class="card">
            <h2>Meios de Contacto</h2>
            <p><strong>E-mail:</strong> contacto@ongsolidaria.org</p>
            <p><strong>Telefone:</strong> (XX) X XXXX-XXXX</p>
            <p><strong>Morada:</strong> Rua da Solidariedade, nº 100</p>
            <a href="#modal-alerta" class="btn-alerta">Ver Alerta de Funcionamento</a>
        </section>
    `,
    
    projetos: `
        <section>
            <h2>Campanhas de Arrecadação de Alimentos</h2>
            <p>Distribuição de mantimentos e itens de primeira necessidade para famílias em situação de vulnerabilidade social ou insegurança alimentar.</p>
        </section>
        <section>   
            <h2>Oficinas Educativas e Profissionalizantes</h2>
            <p>Cursos de capacitação, reforço escolar, letramento digital ou oficinas de arte voltados para crianças, jovens ou adultos, com o objetivo de promover a inclusão social e abrir portas para o mercado de trabalho.</p>
        </section>
        <section>       
            <h2>Atendimento e Apoio à Saúde</h2>
            <p>Prestação de orientações jurídicas, suporte psicológico, campanhas de vacinação ou mutirões de atendimento à saúde preventiva em parceria com profissionais voluntários.</p>
        </section>
    `,
    
    cadastro: `
        <form id="form-colaborador" novalidate>
            <fieldset>
                <legend>Preencha os dados abaixo para ser um de nossos colaboradores.</legend>

                <label for="nome">Nome completo:</label>
                <input type="text" id="nome" name="nome" required>

                <label for="cpf">CPF:</label>
                <input type="text" id="cpf" name="cpf" pattern="[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}" placeholder="000.000.000-00" title="Formato: 000.000.000-00" required>

                <label for="email">E-mail:</label>
                <input type="email" id="email" name="email" required>

                <label for="telefone">Telefone:</label>
                <input type="tel" id="telefone" name="telefone" pattern="\\([0-9]{2}\\)\\s[0-9]\\s[0-9]{4}-[0-9]{4}" placeholder="(00) 0 0000-0000" title="Formato: (00) 0 0000-0000" required>

                <label for="cep">CEP:</label>
                <input type="text" id="cep" name="cep" pattern="[0-9]{5}-[0-9]{3}" placeholder="00000-000" title="Formato: 00000-000" required>
            </fieldset>
            <button type="submit">Enviar</button>
            <p id="mensagem-feedback" style="margin-top: 1rem; font-weight: bold;"></p>
        </form>
    `
};

/**
 * =========================================
 * 2. GESTÃO DE FORMULÁRIOS E DADOS
 * =========================================
 */
const FormHandler = {
    init() {
        const form = document.getElementById('form-colaborador');
        if (form) {
            form.addEventListener('submit', this.handleSubmission);
        }
    },

    handleSubmission(event) {
        event.preventDefault(); // Impede o recarregamento da página
        const form = event.target;
        const feedback = document.getElementById('mensagem-feedback');

        // Validação HTML5 Nativa integrada com JS
        if (!form.checkValidity()) {
            feedback.style.color = 'var(--cor-erro)';
            feedback.textContent = 'Por favor, preencha todos os campos corretamente segundo o formato exigido.';
            return;
        }

        // Recolha de Dados
        const formData = new FormData(form);
        const colaborador = Object.fromEntries(formData.entries());

        // Armazenamento no LocalStorage
        Storage.saveColaborador(colaborador);

        // Feedback de Sucesso ao Utilizador
        feedback.style.color = 'var(--cor-sucesso)';
        feedback.textContent = 'Cadastro realizado com sucesso! Obrigado por colaborar.';
        form.reset(); // Limpa o formulário após sucesso
    }
};

/**
 * =========================================
 * 3. ARMAZENAMENTO (LocalStorage)
 * =========================================
 */
const Storage = {
    saveColaborador(data) {
        // Vai buscar a lista existente ou cria um array vazio
        const colaboradores = JSON.parse(localStorage.getItem('colaboradores')) || [];
        colaboradores.push(data);
        localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
        console.log('Dados guardados localmente:', colaboradores);
    }
};

/**
 * =========================================
 * 4. ROTEAMENTO (SPA Router)
 * =========================================
 */
const Router = {
    init() {
        // Escuta as alterações na URL (quando o hash muda)
        window.addEventListener('hashchange', () => this.loadRoute());
        // Carrega a rota inicial no momento de abertura da página
        this.loadRoute();
    },

    loadRoute() {
        const appRoot = document.getElementById('app-root');
        const currentHash = window.location.hash.replace('#', '') || 'home';

        // Verifica se o template existe, caso contrário carrega a home
        const template = Views[currentHash] || Views.home;
        
        // Injeta o conteúdo dinamicamente no DOM
        appRoot.innerHTML = template;

        // Se a rota for o cadastro, inicializa os eventos do formulário
        if (currentHash === 'cadastro') {
            FormHandler.init();
        }

        // --- CORREÇÃO DO MENU SOBREPOSTO ---
        // 1. Fecha o menu hambúrguer (mobile) se estiver aberto
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle && menuToggle.checked) {
            menuToggle.checked = false;
        }

        // 2. Remove o foco do item clicado para recolher o dropdown no desktop/touch
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        // -----------------------------------
    }
};

/**
 * =========================================
 * 5. INICIALIZAÇÃO DA APLICAÇÃO
 * =========================================
 */
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
});