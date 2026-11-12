# 🛡️ AnoniCare CRM — Privacy & Relational Integrity System

> *"Esquecendo o titular, preservando a contabilidade."*

O **AnoniCare CRM** é uma aplicação web interativa e didática desenvolvida para demonstrar na prática como sistemas que lidam com dados sensíveis (como clínicas de estética e saúde) devem implementar o **Direito ao Esquecimento da LGPD (Lei nº 13.709/2018)** no banco de dados relacional.

A plataforma ilustra visualmente a diferença crítica entre a **exclusão física destrutiva (`DELETE`)** e a **rotina correta de anonimização (`UPDATE`)**, garantindo que relatórios contábeis, emissões fiscais e a rastreabilidade sanitária de insumos (ANVISA) não quebrem por perda de **Chave Estrangeira (`Foreign Key`)**.

---

## 📸 Identidade Visual & Design System

O projeto foi construído respeitando rigorosamente a identidade visual e paleta de cores oficial:

| Cor | Hexadecimal | Papel no Sistema |
| :--- | :--- | :--- |
| **Khaki** | `#A49E8D` | Bordas estruturais, cabeçalhos de tabela e metadados secundários |
| **Taupe** | `#504136` | Tipografia principal, botões de ação e base do Console SQL |
| **Cambridge Blue** | `#689689` | Identidade visual, integridade relacional (`PK ↔ FK`) e botões primários |
| **Tiffany Blue** | `#B2E6D4` | Destaque cruzado (*hover*) entre tabelas pai e filha e superfícies suaves |
| **Aquamarine** | `#83E8BA` | Badges de conformidade LGPD e confirmação de anonimização bem-sucedida |

* **Logo Oficial:** Integrada no topo e rodapé com transparência limpa.
* **Favicon:** Gerado sob medida nos formatos `.ico`, `.png` e `.svg`, destacando o símbolo de proteção (escudo) e cuidado (coração).

---

## 🎯 Arquitetura de Dados Simulada

O sistema simula um relacionamento relacional **1:N (Um para Muitos)** entre duas entidades essenciais da clínica:

```
┌────────────────────────┐                   ┌──────────────────────────────┐
│      tb_clientes       │ 1               N │       tb_movimentacoes       │
├────────────────────────┤                   ├──────────────────────────────┤
│ id_cliente        (PK) │ ◄──────────────── │ fk_id_cliente           (FK) │
│ nome_completo    (PII) │                   │ id_movimentacao         (PK) │
│ cpf              (PII) │                   │ procedimento_insumo          │
│ telefone         (PII) │                   │ qtd_insumos                  │
│ email            (PII) │                   │ valor_contabil               │
│ status_lgpd            │                   │ data_operacao                │
└────────────────────────┘                   └──────────────────────────────┘
```

1. **`tb_clientes` (Tabela Pai / Entidade Forte):** Armazena dados cadastrais e Dados Pessoais Identificáveis (PII).
2. **`tb_movimentacoes` (Tabela Filha / Faturamento e Estoque):** Histórico de procedimentos faturados e baixas de estoque de insumos (Toxina Botulínica, Ácido Hialurônico, Bioestimulador, Fios PDO, etc.).

---

## ⚙️ Funcionalidades Principais

* **Faixa de KPIs em Tempo Real:**
  * **Faturamento Fiscal:** Conciliação financeira das notas emitidas.
  * **Histórico de Estoque:** Contabilidade de ampolas e seringas rastreadas por lotes.
  * **Integridade Relacional (`FK`):** Indicador de saúde das chaves estrangeiras.
* **Simulação de `DELETE` (Erro Clássico):** Demonstra como apagar o cliente quebra a integridade referencial, gerando **registros órfãos** e inconsistência contábil imediata.
* **Rotina de Anonimização (`UPDATE` - LGPD):** Sobrescreve dados pessoais com valores anônimos irreversíveis, mantendo a chave primária (`id_cliente`) intacta e preservando 100% do histórico financeiro.
* **Destaque Cruzado (*Hover* Interativo):** Ao passar o mouse sobre qualquer cliente ou venda, o relacionamento entre a `PK` e todas as suas `FKs` correspondentes é iluminado na tela.
* **Console SQL Didático:** Apresenta lado a lado a sintaxe SQL perigosa (`DELETE`) versus o script seguro de compliance (`UPDATE`).
* **Log de Auditoria LGPD:** Protocolo de conformidade que registra o evento e o ID afetado **sem salvar dados pessoais antigos**, atendendo às normas de compliance.
* **Chatbox de Dúvidas Frequentes (FAQ):** Assistente integrado com respostas rápidas sobre a LGPD, chaves estrangeiras, registros órfãos e roteiro de demonstração acadêmica.

---

## ⚖️ Conexão Jurídica (Lei nº 13.709/2018 — LGPD)

* **Art. 12 da LGPD:** Dados anonimizados deixam de ser considerados dados pessoais, visto que o processo de anonimização não permite a identificação do indivíduo.
* **Art. 16, I e IV da LGPD:** Autoriza a conservação de dados para o cumprimento de obrigação legal/regulatória (como exigências contábeis da Receita Federal e rastreabilidade de lotes da ANVISA), desde que anonimizados os atributos pessoais.
* **Art. 18, IV e VI da LGPD:** O direito do titular à eliminação dos dados é atendido com a descaracterização cadastral (`UPDATE`), harmonizando a privacidade com a governança da empresa.

---

## 🛠️ Ferramentas & Tecnologias Utilizadas

* **Linguagens:** HTML5 semântico, CSS3 moderno (Custom Properties / Flexbox / Grid) e JavaScript puro (ES6+).
* **Arquitetura:** *Single Page Application* (SPA) com gerenciamento de estado 100% em memória no cliente (*Zero Backend Setup*).
* **Tipografia:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (UI limpa) e [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (código e chaves relacionais).
* **Paleta & Design:** Cores extraídas via Coolors e otimizadas para alto contraste, acessibilidade e harmonia visual.
* **Hospedagem Recomendada:** [Netlify](https://www.netlify.com/) (Deploy contínuo via GitHub ou Netlify Drop).

---

## 🚀 Como Executar Localmente

Como o projeto é construído em front-end puro, nenhuma instalação ou dependência de servidor é necessária:

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/AnoniCare.git
   ```
2. Abra a pasta do projeto:
   ```bash
   cd AnoniCare
   ```
3. Dê um duplo clique no arquivo `index.html` ou abra-o em qualquer navegador web moderno.
