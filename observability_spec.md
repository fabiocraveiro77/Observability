# Especificação do Sistema de Observabilidade (Abordagem Log-Based)

## 1. Visão Geral
Este documento define a arquitetura para o sistema customizado de observabilidade focado em integrações de pagamentos e core bancário. A ferramenta atuará como um receptor centralizado de **eventos estruturados (logs)** gerados pelas aplicações durante seus ciclos de execução.

**Stack Tecnológica:** NestJS (Backend), Angular (Frontend), TypeORM, MySQL.
**Retenção:** Permanente (Histórico completo para compliance).

---

## 2. Estrutura de Dados (Modelo de Evento Único)

A arquitetura utiliza uma única tabela `observability_events`. A estrutura foi refinada para comportar cenários bancários, rastrear estornos e duplicidades, além de fornecer telemetria técnica.

### Tabela: `observability_events`

| Coluna | Tipo | Descrição | Origem |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | Auto-incremento. Chave primária. | Banco de Dados |
| `timestamp` | `DATETIME(6)` | Data e hora exata da ocorrência do evento. O NestJS usará a diferença entre as linhas para calcular a latência. | Aplicação |
| `app_name` | `VARCHAR(100)` | Nome da aplicação/rotina (ex: `CRON_ABC`). | Aplicação |
| `execution_id` | `VARCHAR(36)` | UUID gerado a cada execução (lote). Usado para identificar tentativas e duplicidades. | Aplicação |
| `transaction_id` | `VARCHAR(100)` | Número de identificação oriundo do Core Bancário. É a chave central do pagamento. | Core Bancário |
| `trace_id` | `VARCHAR(36)` | Fio condutor (Distributed Tracing). Mantém a rastreabilidade entre filas/workers. | Aplicação (Origem) |
| `partner_name` | `VARCHAR(50)` | Qual parceiro está sendo acessado? (ex: `BANCO_X`). Usado para agregações. | Padronizado |
| `step_current` | `INT` | Número do passo atual no fluxo lógico. | Aplicação |
| `step_total` | `INT` | Total de passos previstos no fluxo lógico. | Aplicação |
| `action_code` | `VARCHAR(50)` | Ação sendo realizada (Ver lista padronizada abaixo). | Padronizado |
| `status` | `VARCHAR(50)` | Situação da ação (Ver lista padronizada abaixo). | Padronizado |
| `payload_data` | `JSON` | Dados transacionais lidos do banco. | Aplicação |
| `payload_type` | `JSON` | Tipo de dados contidos no payload | Aplicação |
| `request_data` | `JSON` | Exclusivo para payloads enviados externamente. | Aplicação |
| `response_data`| `JSON` | Exclusivo para retornos externos. | Parceiro/API |
| `error_stacktrace`| `LONGTEXT` | Isola erros técnicos sem poluir os dados de negócio. | Aplicação |
| `internal_reference`| `VARCHAR(255)` | Referência interna para cruzamento. | Aplicação |
| `external_reference`| `VARCHAR(255)` | Referência gerada pelo parceiro (ex: NSU). | Parceiro |

---

## 3. Listas Padronizadas (Dicionário de Dados)

### 3.1 Lista de `action_code`
- `READ_DATABASE`: Extração inicial de dados.
- `PREPARE_PAYLOAD`: Transformação/construção de XML/JSON.
- `SEND_TO_PARTNER`: Requisição HTTP/REST para parceiro.
- `UPDATE_DATABASE`: Escrita do status final no banco local.
- `ERROR_HANDLING`: Tratamento de exceções (acionado no `catch`).

### 3.2 Lista de `status`
- `SUCCESS`: Ação concluída perfeitamente (HTTP 2xx).
- `HTTP_ERROR`: Parceiro respondeu com erro (ex: 400, 500).
- `TIMEOUT`: Conexão caiu por tempo excedido.
- `SETTLED`: Pagamento liquidado.
- `COMMITED`: Aceito pelo parceiro, mas ainda não liquidado.
- `PENDING`: Retornado pelos webhooks, geralmente quando não houve atualizacao no registro do lado do parceiro.
- `BUSINESS_ERROR`: Parceiro recusou a operação por regra de negócio (ex: Saldo Insuficiente).
- `VALIDATION_FAILED`: Dados locais falharam na consistência antes do envio.
- `EXCEPTION`: Quebra de código bruta (bug, memory leak).

---

## 4. Monitoramento de Saúde e TTL (Heartbeat)

Para garantir que saibamos quando uma aplicação travou ou parou de rodar silenciosamente, teremos uma tabela focada exclusivamente em receber um "ping" (heartbeat) no momento em que cada aplicação acorda. O modelo segue o padrão de inserção (append-only).

### Tabela: `app_heartbeats`

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `BIGINT` | Auto-incremento. Chave primária. |
| `app_name` | `VARCHAR(100)` | Nome da aplicação/rotina (ex: `CRON_ABC`). |
| `execution_id` | `VARCHAR(36)` | UUID do lote atual. |
| `timestamp` | `DATETIME(6)` | Data e hora exata em que o log foi emitido (Logo no começo da execução). |
| `ttl_seconds` | `INT` | Tempo (em segundos) esperado para o próximo ping. |

**Lógica de Detecção:** O motor verificará o último registro de cada `app_name`. Se a diferença de tempo entre o `timestamp` deste último ping e a hora atual for maior que `ttl_seconds`, conclui-se que a aplicação **travou ou morreu**.

---

## 5. O Padrão de Implementação nas Aplicações (`try/catch/finally`)

```typescript
async processarLote() {
  const executionId = uuidv4(); 
  const traceId = uuidv4();
  
  // HEARTBEAT (Obrigatório em cada começo de execução)
  await this.ttlClient.ping({
    appName: 'CRON_ABC', executionId, ttlSeconds: 45
  });

  try {
    // PASSO 1: Lógica de DB e disparo de observability_events
    // PASSO 2: Integração e disparo de observability_events
  } catch (error) {
    // TRATAMENTO DE ERROS e disparo de observability_events
  }
}
```

---

## 6. Contexto para o Desenvolvimento (Visão Geral para Agentes)
Esta não é uma aplicação CRUD comum. É um motor de **observabilidade de missão crítica** para integrações de core bancário. O objetivo primário é fornecer rastreabilidade, auditoria e depuração ultrarrápida.
*   As aplicações clientes inserem os dados passivamente.
*   O Backend (NestJS) expõe consultas e consolida métricas.
*   O Frontend (Angular) exibe linhas do tempo dinâmicas e dashboards que permitem a analistas e desenvolvedores tomarem decisões assertivas.

---

## 7. Boas Práticas e Arquitetura

### 7.1 Banco de Dados (MySQL)
*   **Índices:** É OBRIGATÓRIA a criação de índices nas colunas `transaction_id`, `execution_id`, `app_name` e `timestamp`. Sem isso, as consultas de agrupamento tornarão o sistema inutilizável rapidamente devido ao alto volume (>10k eventos/dia).
*   **Performance:** A inserção deve ser rápida. A tabela não deve possuir constraints limitadoras de negócio que façam as aplicações clientes falharem ao tentar logar um evento.

### 7.2 Backend (NestJS)
*   **Desacoplamento:** O serviço que consulta os logs deve ser separado do serviço de agregação (dashboard).
*   **Paginação e Filtros:** Todas as consultas na API Rest devem ser construídas prevendo um grande volume de dados. Uso obrigatório de DTOs e validação (class-validator).

### 7.3 Frontend (Angular)
*   **Visualização Limpa:** A UI deve focar na usabilidade. A jornada de uma transação deve ser exibida como uma Linha do Tempo (Timeline).
*   **Payloads Pesados:** Os campos JSON (Request, Response, Payload) só devem ser renderizados ou buscados quando o usuário expandir um nó específico. Utilizar componentes de visualização JSON colapsáveis para evitar poluição visual.

---

## 8. Perfil Exigido para os Desenvolvedores (Agentes Executores)

*   **Agente Backend / DBA:** Especialista em Node.js (NestJS) e modelagem relacional. Deve ter foco obsessivo em performance de queries, uso correto de TypeORM, criação de migrations seguras e estruturação limpa de endpoints (RESTful).
*   **Agente Frontend:** Especialista em Angular e TypeScript. Precisa ter experiência em criação de dashboards de monitoramento e componentes complexos (timelines). Sensibilidade estética e foco total em UX são cruciais, pois logs desorganizados não ajudam ninguém.

---

## 9. Exemplos de Dados (Mocks)

### 9.1 Exemplo de Inserção: `app_heartbeats`
```json
{
  "app_name": "CRON_PAGAMENTOS",
  "execution_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "timestamp": "2026-08-13T10:00:00.000Z",
  "ttl_seconds": 30
}
```

### 9.2 Exemplo de Inserção: `observability_events` (Sucesso na Integração)
```json
{
  "timestamp": "2026-08-13T10:00:05.123Z",
  "app_name": "CRON_PAGAMENTOS",
  "execution_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "transaction_id": "CORE-998877",
  "trace_id": "trace-9999-8888",
  "partner_name": "API_PIX_CENTRAL",
  "step_current": 2,
  "step_total": 4,
  "action_code": "SEND_TO_PARTNER",
  "status": "SUCCESS",
  "payload_data": null,
  "request_data": { "chave_pix": "123.456.789-00", "valor": 500.00 },
  "response_data": { "http_status": 200, "endToEndId": "E123456789" },
  "internal_reference": "tbl_pix_out_id_443",
  "external_reference": "E123456789"
}
```

### 9.3 Exemplo de Inserção: `observability_events` (Erro Técnico)
```json
{
  "timestamp": "2026-08-13T10:00:10.500Z",
  "app_name": "CRON_PAGAMENTOS",
  "execution_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "transaction_id": "CORE-998877",
  "trace_id": "trace-9999-8888",
  "partner_name": "BANCO_DESTINO",
  "step_current": 3,
  "step_total": 4,
  "action_code": "ERROR_HANDLING",
  "status": "TIMEOUT",
  "error_stacktrace": "Error: read ECONNRESET at TLSWrap.onStreamRead (internal/stream_base_commons.js:209:20)"
}
```
