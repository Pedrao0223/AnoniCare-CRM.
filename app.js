/**
 * ============================================================================
 * AnoniCare CRM — Privacy & Relational Integrity System
 * Versão Minimalista + Chatbox de Perguntas Frequentes (FAQ)
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ETAPA 1: Dados Simulados (Mock Database - RNF02)
// ----------------------------------------------------------------------------
const DADOS_INICIAIS_CLIENTES = [
  {
    id_cliente: 101,
    nome_completo: 'Mariana Vasconcelos',
    cpf: '348.912.408-19',
    telefone: '(11) 99412-8830',
    email: 'mariana@email.com.br',
    status_lgpd: 'ATIVO',
    destaque_caso: null
  },
  {
    id_cliente: 102,
    nome_completo: 'Camila Mendonça Prado',
    cpf: '419.805.231-74',
    telefone: '(11) 98765-4321',
    email: 'camila.prado@uol.com.br',
    status_lgpd: 'ATIVO',
    destaque_caso: 'Solicitou Exclusão (Briga)'
  },
  {
    id_cliente: 103,
    nome_completo: 'Renato Albuquerque',
    cpf: '275.640.198-52',
    telefone: '(11) 97120-5591',
    email: 'renato@corp.com.br',
    status_lgpd: 'ATIVO',
    destaque_caso: null
  },
  {
    id_cliente: 104,
    nome_completo: 'Beatriz Siqueira',
    cpf: '502.318.774-06',
    telefone: '(11) 99804-1127',
    email: 'bia.siqueira@gmail.com',
    status_lgpd: 'ATIVO',
    destaque_caso: null
  }
];

const DADOS_INICIAIS_MOVIMENTACOES = [
  {
    id_movimentacao: 'MOV-501',
    fk_id_cliente: 101,
    procedimento_insumo: '1x Ampola Toxina Botulínica',
    qtd_insumos: 1,
    valor_contabil: 1450.00,
    data_operacao: '03/11/2026'
  },
  {
    id_movimentacao: 'MOV-502',
    fk_id_cliente: 102,
    procedimento_insumo: '2x Seringas Ácido Hialurônico',
    qtd_insumos: 2,
    valor_contabil: 2400.00,
    data_operacao: '05/11/2026'
  },
  {
    id_movimentacao: 'MOV-503',
    fk_id_cliente: 102,
    procedimento_insumo: '1x Frasco Bioestimulador',
    qtd_insumos: 1,
    valor_contabil: 2150.00,
    data_operacao: '08/11/2026'
  },
  {
    id_movimentacao: 'MOV-504',
    fk_id_cliente: 103,
    procedimento_insumo: '4x Fios de Sustentação PDO',
    qtd_insumos: 4,
    valor_contabil: 1980.00,
    data_operacao: '09/11/2026'
  },
  {
    id_movimentacao: 'MOV-505',
    fk_id_cliente: 104,
    procedimento_insumo: '1x Kit Peeling Químico',
    qtd_insumos: 1,
    valor_contabil: 780.00,
    data_operacao: '10/11/2026'
  },
  {
    id_movimentacao: 'MOV-506',
    fk_id_cliente: 101,
    procedimento_insumo: '1x Sessão Laser Lavieen',
    qtd_insumos: 1,
    valor_contabil: 1250.00,
    data_operacao: '11/11/2026'
  }
];

// Base de Perguntas Frequentes (FAQ) para o Chatbox
const PERGUNTAS_FREQUENTES = [
  {
    id: 'delete-problema',
    pergunta: 'Por que não usar DELETE?',
    resposta: 'Se você executar um <code>DELETE</code> na tabela de clientes, o <code>id_cliente</code> (Chave Primária) deixa de existir. Como as vendas e baixas de estoque dependem desse ID via <strong>Chave Estrangeira (FK)</strong>, elas viram registros órfãos ou são apagadas, gerando furo de caixa e problema fiscal.'
  },
  {
    id: 'update-solucao',
    pergunta: 'Como funciona a Anonimização?',
    resposta: 'Usamos um comando <code>UPDATE</code> que substitui Nome, CPF, Telefone e E-mail por valores genéricos (ex: <em>"Cliente Anonimizado"</em>), mas <strong>preserva o ID numérico (#102)</strong>. Assim, o cliente é esquecido e a contabilidade continua 100% íntegra.'
  },
  {
    id: 'fk-orfao',
    pergunta: 'O que é um Registro Órfão?',
    resposta: 'É uma linha na tabela filha (<code>tb_movimentacoes</code>) cujo <code>fk_id_cliente</code> aponta para um cliente que não existe mais na tabela pai (<code>tb_clientes</code>). Isso quebra a integridade relacional do banco.'
  },
  {
    id: 'base-legal',
    pergunta: 'Qual a base legal na LGPD?',
    resposta: 'Combinamos 3 artigos da LGPD: <strong>Art. 18</strong> (direito do titular à eliminação), <strong>Art. 16</strong> (direito da clínica de reter histórico fiscal/ANVISA com dados anonimizados) e <strong>Art. 12</strong> (dados anonimizados não são considerados dados pessoais).'
  },
  {
    id: 'log-auditoria',
    pergunta: 'O que vai para o Log LGPD?',
    resposta: 'O Log registra apenas a <strong>data/hora</strong>, o <strong>protocolo</strong> e o <strong>ID numérico</strong> que foi anonimizado, jamais salvando os dados pessoais antigos. Isso comprova a conformidade sem violar a privacidade.'
  },
  {
    id: 'como-testar',
    pergunta: 'Como demonstrar o sistema?',
    resposta: '1️⃣ Passe o mouse sobre a cliente <strong>#102</strong> para ver suas vendas destacadas.<br>2️⃣ Clique em <strong>"Forçar DELETE"</strong> para ver o erro de chave estrangeira.<br>3️⃣ Clique em <strong>"Restaurar Dados"</strong> e depois em <strong>"Anonimizar"</strong> para mostrar a solução correta!'
  }
];

let clientes = [];
let movimentacoes = [];
let logsAuditoria = [];
let ultimoIdInspecionado = 102;
let modoConsoleSql = 'comparativo';
let ultimoSqlExecutado = null;

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterHoraAtual() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ----------------------------------------------------------------------------
// ETAPA 3.1: calcularIndicadores() — RF01
// ----------------------------------------------------------------------------
function calcularIndicadores() {
  const idsValidos = new Set(clientes.map(c => c.id_cliente));

  let faturamentoValido = 0;
  let faturamentoPerdido = 0;
  let insumosValidos = 0;
  let qtdOrfaos = 0;

  movimentacoes.forEach(m => {
    if (idsValidos.has(m.fk_id_cliente)) {
      faturamentoValido += m.valor_contabil;
      insumosValidos += m.qtd_insumos;
    } else {
      faturamentoPerdido += m.valor_contabil;
      qtdOrfaos += 1;
    }
  });

  const integro = qtdOrfaos === 0;
  const qtdAnon = clientes.filter(c => c.status_lgpd === 'ANONIMIZADO').length;

  // KPI 1: Faturamento
  const cardFat = document.getElementById('kpi-card-faturamento');
  const valFat = document.getElementById('kpi-val-faturamento');
  const deltaFat = document.getElementById('kpi-delta-faturamento');
  const footFat = document.getElementById('kpi-foot-faturamento');

  valFat.textContent = formatarMoeda(faturamentoValido);
  cardFat.className = integro ? 'kpi-card' : 'kpi-card kpi-error';
  deltaFat.className = integro ? 'kpi-badge badge-ok' : 'kpi-badge badge-err';
  deltaFat.textContent = integro ? '100% Conciliado' : `- ${formatarMoeda(faturamentoPerdido)}`;
  footFat.textContent = integro
    ? `${movimentacoes.length} vendas com referência válida`
    : `Alerta fiscal: ${qtdOrfaos} venda(s) sem cliente válido`;

  // KPI 2: Estoque
  const cardEst = document.getElementById('kpi-card-estoque');
  const valEst = document.getElementById('kpi-val-estoque');
  const deltaEst = document.getElementById('kpi-delta-estoque');
  const footEst = document.getElementById('kpi-foot-estoque');

  valEst.textContent = `${insumosValidos} insumos`;
  cardEst.className = integro ? 'kpi-card' : 'kpi-card kpi-error';
  deltaEst.className = integro ? 'kpi-badge badge-ok' : 'kpi-badge badge-err';
  deltaEst.textContent = integro ? 'Rastreado' : 'Sem Lastro';
  footEst.textContent = integro
    ? `${movimentacoes.length} baixas vinculadas a clientes`
    : `${qtdOrfaos} baixa(s) de estoque órfã(s)`;

  // KPI 3: Integridade FK
  const cardInt = document.getElementById('kpi-card-integridade');
  const valInt = document.getElementById('kpi-val-integridade');
  const deltaInt = document.getElementById('kpi-delta-integridade');
  const footInt = document.getElementById('kpi-foot-integridade');

  cardInt.className = integro ? 'kpi-card' : 'kpi-card kpi-error';
  valInt.textContent = integro ? '100% Íntegro' : 'Erro de Foreign Key';
  deltaInt.className = integro ? 'kpi-badge badge-ok' : 'kpi-badge badge-err';
  deltaInt.textContent = integro
    ? (qtdAnon > 0 ? `LGPD OK (${qtdAnon})` : 'PK ↔ FK OK')
    : `${qtdOrfaos} Órfão(s)`;
  footInt.textContent = integro
    ? 'Passe o mouse nas linhas para ver o vínculo 1:N'
    : 'Falha relacional causada por exclusão física (DELETE)';
}

// ----------------------------------------------------------------------------
// ETAPA 3.2: executarDelete(id) — RF04
// ----------------------------------------------------------------------------
function executarDelete(id) {
  const alvo = clientes.find(c => c.id_cliente === id);
  if (!alvo) return;

  ultimoIdInspecionado = id;
  modoConsoleSql = 'ultimo';

  const movsAfetadas = movimentacoes.filter(m => m.fk_id_cliente === id);
  const valorAfetado = movsAfetadas.reduce((s, m) => s + m.valor_contabil, 0);

  clientes = clientes.filter(c => c.id_cliente !== id);

  ultimoSqlExecutado = {
    tipo: 'DELETE',
    id_cliente: id,
    qtd_orfaos: movsAfetadas.length,
    valor_afetado: valorAfetado
  };

  logsAuditoria.unshift({
    protocolo: `ERR-FK-${id}`,
    horario: obterHoraAtual(),
    tipo: 'ERRO',
    texto: `DELETE físico no ID #${id}: gerou ${movsAfetadas.length} registro(s) órfão(s) e perda contábil de ${formatarMoeda(valorAfetado)}.`
  });

  renderizarTudo();
}

// ----------------------------------------------------------------------------
// ETAPA 3.3: executarAnonimizacao(id) — RF05 & RF07
// ----------------------------------------------------------------------------
function executarAnonimizacao(id) {
  const alvo = clientes.find(c => c.id_cliente === id);
  if (!alvo || alvo.status_lgpd === 'ANONIMIZADO') return;

  ultimoIdInspecionado = id;
  modoConsoleSql = 'ultimo';

  alvo.nome_completo = 'Cliente Anonimizado';
  alvo.cpf = '***.***.***-**';
  alvo.telefone = '(00) 00000-0000';
  alvo.email = 'removido@lgpd.local';
  alvo.status_lgpd = 'ANONIMIZADO';

  const movsPreservadas = movimentacoes.filter(m => m.fk_id_cliente === id);
  const valorPreservado = movsPreservadas.reduce((s, m) => s + m.valor_contabil, 0);

  ultimoSqlExecutado = {
    tipo: 'UPDATE',
    id_cliente: id,
    qtd_preservados: movsPreservadas.length,
    valor_preservado: valorPreservado
  };

  logsAuditoria.unshift({
    protocolo: `LGPD-${id}-${Math.floor(100 + Math.random() * 900)}`,
    horario: obterHoraAtual(),
    tipo: 'OK',
    texto: `ID #${id} anonimizado via UPDATE. Dados pessoais removidos e ${formatarMoeda(valorPreservado)} preservados no caixa.`
  });

  renderizarTudo();
}

// ----------------------------------------------------------------------------
// RF08: resetarSimulacao()
// ----------------------------------------------------------------------------
function resetarSimulacao() {
  clientes = JSON.parse(JSON.stringify(DADOS_INICIAIS_CLIENTES));
  movimentacoes = JSON.parse(JSON.stringify(DADOS_INICIAIS_MOVIMENTACOES));
  ultimoIdInspecionado = 102;
  modoConsoleSql = 'comparativo';
  ultimoSqlExecutado = null;

  logsAuditoria = [
    {
      protocolo: 'SISTEMA',
      horario: obterHoraAtual(),
      tipo: 'INFO',
      texto: 'Simulação pronta. A cliente #102 solicitou exclusão dos dados: compare o efeito entre "Anonimizar" e "Forçar DELETE".'
    }
  ];

  renderizarTudo();
}

// ----------------------------------------------------------------------------
// Renderização das Tabelas (RF02 e RF03)
// ----------------------------------------------------------------------------
function renderizarTabelaClientes() {
  const tbody = document.getElementById('tbody-clientes');

  if (clientes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding: 1.5rem; color: var(--danger-text); font-weight: 600;">
          Todos os clientes foram removidos. Clique em "Restaurar Dados".
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = clientes.map(c => {
    const isAnon = c.status_lgpd === 'ANONIMIZADO';
    const tagCaso = c.destaque_caso && !isAnon
      ? `<span class="case-tag">${c.destaque_caso}</span>`
      : '';

    return `
      <tr class="${isAnon ? 'row-anonymized' : ''}"
          data-client-id="${c.id_cliente}"
          onmouseenter="destacarVinculo(${c.id_cliente})"
          onmouseleave="limparDestaque()">
        <td>
          <span class="pk-fk-badge">PK #${c.id_cliente}</span>
        </td>
        <td>
          <div class="client-primary ${isAnon ? 'is-masked' : ''}">
            <span>${c.nome_completo}</span>
            ${tagCaso}
          </div>
          <div class="client-secondary">${c.email} • ${c.telefone}</div>
        </td>
        <td>
          <span class="client-secondary">${c.cpf}</span>
        </td>
        <td>
          <span class="status-pill ${isAnon ? 'pill-anon' : 'pill-active'}">
            ${isAnon ? '✓ Anonimizado' : 'Ativo'}
          </span>
        </td>
        <td>
          <div class="row-actions">
            <button type="button"
                    class="btn-row btn-row-anon"
                    ${isAnon ? 'disabled' : ''}
                    onclick="executarAnonimizacao(${c.id_cliente})">
              ${isAnon ? 'Protegido' : 'Anonimizar (LGPD)'}
            </button>
            <button type="button"
                    class="btn-row btn-row-delete"
                    onclick="executarDelete(${c.id_cliente})">
              Forçar DELETE
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderizarTabelaMovimentacoes() {
  const tbody = document.getElementById('tbody-movimentacoes');
  const idsValidos = new Set(clientes.map(c => c.id_cliente));

  tbody.innerHTML = movimentacoes.map(m => {
    const orfao = !idsValidos.has(m.fk_id_cliente);

    return `
      <tr class="${orfao ? 'row-orphan' : ''}"
          data-fk-id="${m.fk_id_cliente}"
          onmouseenter="destacarVinculo(${m.fk_id_cliente})"
          onmouseleave="limparDestaque()">
        <td>
          <span class="pk-fk-badge ${orfao ? 'fk-broken' : ''}">
            FK #${m.fk_id_cliente}
          </span>
        </td>
        <td>
          <div style="font-weight: 600;">${m.procedimento_insumo}</div>
          <div class="client-secondary">${m.id_movimentacao} • ${m.data_operacao}</div>
        </td>
        <td class="price-cell">${formatarMoeda(m.valor_contabil)}</td>
        <td>
          <span class="status-pill ${orfao ? 'pill-orphan' : 'pill-active'}">
            ${orfao ? '⚠️ Registro Órfão / FK Quebrada' : '✓ FK Íntegra'}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// ----------------------------------------------------------------------------
// ETAPA 4.1: Destaque Cruzado (Hover)
// ----------------------------------------------------------------------------
function destacarVinculo(id) {
  document.querySelectorAll('#tbody-clientes tr').forEach(tr => {
    tr.classList.toggle('row-hover-link', Number(tr.dataset.clientId) === id);
  });
  document.querySelectorAll('#tbody-movimentacoes tr').forEach(tr => {
    tr.classList.toggle('row-hover-link', Number(tr.dataset.fkId) === id);
  });
}

function limparDestaque() {
  document.querySelectorAll('.row-hover-link').forEach(tr => tr.classList.remove('row-hover-link'));
}

// ----------------------------------------------------------------------------
// RF06 & RF07: Console SQL e Log de Auditoria
// ----------------------------------------------------------------------------
function alternarAbaSql(modo) {
  modoConsoleSql = modo;
  renderizarConsoleSql();
}

function renderizarConsoleSql() {
  const pre = document.getElementById('sql-code-output');
  const note = document.getElementById('sql-impact-banner');
  const btnComp = document.getElementById('tab-sql-comparativo');
  const btnUlt = document.getElementById('tab-sql-ultimo');
  const idRef = ultimoIdInspecionado || 102;

  if (modoConsoleSql === 'ultimo' && ultimoSqlExecutado) {
    btnUlt.classList.add('active');
    btnComp.classList.remove('active');

    if (ultimoSqlExecutado.tipo === 'DELETE') {
      pre.innerHTML = `<span class="sql-cm-bad">-- ❌ Comando executado (Quebra a Foreign Key)</span>
<span class="sql-kw">DELETE FROM</span> <span class="sql-tb">tb_clientes</span>
<span class="sql-kw">WHERE</span> id_cliente = <span class="sql-str">${ultimoSqlExecutado.id_cliente}</span>;`;
      note.textContent = `⚠️ Impacto: A chave #${ultimoSqlExecutado.id_cliente} foi apagada, deixando ${ultimoSqlExecutado.qtd_orfaos} venda(s) órfã(s).`;
    } else {
      pre.innerHTML = `<span class="sql-cm-ok">-- ✅ Comando executado (Anonimização segura LGPD)</span>
<span class="sql-kw">UPDATE</span> <span class="sql-tb">tb_clientes</span>
<span class="sql-kw">SET</span> nome_completo = <span class="sql-str">'Cliente Anonimizado'</span>,
    cpf           = <span class="sql-str">'***.***.***-**'</span>,
    telefone      = <span class="sql-str">'(00) 00000-0000'</span>,
    email         = <span class="sql-str">'removido@lgpd.local'</span>,
    status_lgpd   = <span class="sql-str">'ANONIMIZADO'</span>
<span class="sql-kw">WHERE</span> id_cliente = <span class="sql-str">${ultimoSqlExecutado.id_cliente}</span>;`;
      note.textContent = `✓ Impacto: Dados pessoais removidos e PK #${ultimoSqlExecutado.id_cliente} mantida intacta.`;
    }
  } else {
    btnComp.classList.add('active');
    btnUlt.classList.remove('active');

    pre.innerHTML = `<span class="sql-cm-bad">-- ❌ O QUE NÃO FAZER (Quebra a Foreign Key)</span>
<span class="sql-kw">DELETE FROM</span> <span class="sql-tb">tb_clientes</span> <span class="sql-kw">WHERE</span> id_cliente = <span class="sql-str">${idRef}</span>;

<span class="sql-cm-ok">-- ✅ O QUE O ANONICARE CRM FAZ (Preserva a PK e o financeiro)</span>
<span class="sql-kw">UPDATE</span> <span class="sql-tb">tb_clientes</span>
<span class="sql-kw">SET</span> nome_completo = <span class="sql-str">'Cliente Anonimizado'</span>,
    cpf = <span class="sql-str">'***.***.***-**'</span>, status_lgpd = <span class="sql-str">'ANONIMIZADO'</span>
<span class="sql-kw">WHERE</span> id_cliente = <span class="sql-str">${idRef}</span>;`;
    note.textContent = 'Clique em "Anonimizar" ou "Forçar DELETE" na tabela acima para testar no banco.';
  }
}

function renderizarLogsAuditoria() {
  const list = document.getElementById('audit-log-list');
  const count = document.getElementById('audit-log-count');
  const totalOk = logsAuditoria.filter(l => l.tipo === 'OK').length;
  count.textContent = `${totalOk} protocolo(s)`;

  list.innerHTML = logsAuditoria.map(l => {
    const cls = l.tipo === 'OK' ? 'audit-ok' : (l.tipo === 'ERRO' ? 'audit-err' : '');
    return `
      <div class="audit-item ${cls}">
        <div class="audit-meta">
          <span>${l.protocolo}</span>
          <span>${l.horario}</span>
        </div>
        <div>${l.texto}</div>
      </div>
    `;
  }).join('');
}

function renderizarTudo() {
  calcularIndicadores();
  renderizarTabelaClientes();
  renderizarTabelaMovimentacoes();
  renderizarConsoleSql();
  renderizarLogsAuditoria();
}

// ----------------------------------------------------------------------------
// Chatbox de Perguntas Frequentes (FAQ)
// ----------------------------------------------------------------------------
function inicializarFaqChatbox() {
  const chipsContainer = document.getElementById('faq-chips');
  const messagesContainer = document.getElementById('faq-messages');

  chipsContainer.innerHTML = PERGUNTAS_FREQUENTES.map(item => `
    <button type="button" class="faq-chip" onclick="selecionarPerguntaFaq('${item.id}')">
      ${item.pergunta}
    </button>
  `).join('');

  messagesContainer.innerHTML = `
    <div class="chat-msg msg-bot">
      Olá! 👋 Sou o assistente do <strong>AnoniCare CRM</strong>. Escolha uma pergunta rápida abaixo ou digite sua dúvida sobre LGPD e Banco de Dados.
    </div>
  `;
}

function toggleFaqChatbox(forcarEstado) {
  const box = document.getElementById('faq-chatbox');
  const abrir = typeof forcarEstado === 'boolean' ? forcarEstado : !box.classList.contains('is-open');
  box.classList.toggle('is-open', abrir);
}

function adicionarMensagemFaq(texto, autor) {
  const container = document.getElementById('faq-messages');
  const div = document.createElement('div');
  div.className = `chat-msg ${autor === 'user' ? 'msg-user' : 'msg-bot'}`;
  div.innerHTML = texto;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function selecionarPerguntaFaq(id) {
  const item = PERGUNTAS_FREQUENTES.find(p => p.id === id);
  if (!item) return;

  adicionarMensagemFaq(item.pergunta, 'user');
  setTimeout(() => {
    adicionarMensagemFaq(item.resposta, 'bot');
  }, 180);
}

function enviarPerguntaFaq(event) {
  event.preventDefault();
  const input = document.getElementById('faq-input');
  const texto = input.value.trim();
  if (!texto) return;

  adicionarMensagemFaq(texto, 'user');
  input.value = '';

  const q = texto.toLowerCase();
  let resposta = 'Ótima pergunta! No <strong>AnoniCare CRM</strong>, resolvemos solicitações de exclusão da LGPD usando <code>UPDATE</code> (anonimização) no lugar de <code>DELETE</code>, mantendo o <code>id_cliente</code> intacto para não quebrar as chaves estrangeiras do faturamento e do estoque.';

  if (q.includes('delete') || q.includes('excluir') || q.includes('apagar')) {
    resposta = PERGUNTAS_FREQUENTES[0].resposta;
  } else if (q.includes('update') || q.includes('anonimiz')) {
    resposta = PERGUNTAS_FREQUENTES[1].resposta;
  } else if (q.includes('órfão') || q.includes('orfao') || q.includes('fk') || q.includes('chave') || q.includes('foreign')) {
    resposta = PERGUNTAS_FREQUENTES[2].resposta;
  } else if (q.includes('lgpd') || q.includes('lei') || q.includes('artigo') || q.includes('art') || q.includes('fiscal')) {
    resposta = PERGUNTAS_FREQUENTES[3].resposta;
  } else if (q.includes('log') || q.includes('auditoria') || q.includes('protocolo')) {
    resposta = PERGUNTAS_FREQUENTES[4].resposta;
  } else if (q.includes('como') || q.includes('testar') || q.includes('passo')) {
    resposta = PERGUNTAS_FREQUENTES[5].resposta;
  }

  setTimeout(() => {
    adicionarMensagemFaq(resposta, 'bot');
  }, 220);
}

document.addEventListener('DOMContentLoaded', () => {
  resetarSimulacao();
  inicializarFaqChatbox();
});
