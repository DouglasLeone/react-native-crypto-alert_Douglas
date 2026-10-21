# CriptoAlert - Testes Automatizados

Aplicativo Expo/React Native em TypeScript para monitoramento de preços de criptomoedas, conversão entre moedas e gerenciamento de alertas com persistência local.

Este repositório contém uma suíte completa de **testes unitários automatizados** desenvolvida com **Jest** e **React Native Testing Library**, superando a meta obrigatória de **50% de cobertura** em todos os indicadores (*Lines, Branches, Functions e Statements*).

---

## 📦 1. Instalação das Dependências

Para instalar todas as dependências do projeto e as ferramentas de teste, execute no terminal:

```bash
npm install
```

> **Nota:** As dependências de teste configuradas incluem `jest`, `jest-expo`, `@testing-library/react-native`, `test-renderer` e `@react-native-async-storage/async-storage`.

---

## 🚀 2. Execução dos Testes

Para executar toda a suíte de testes unitários:

```bash
npm test -- --watchAll=false
```

Para rodar em modo contínuo de observação (*watch mode*):

```bash
npm test -- --watchAll
```

---

## 📊 3. Geração do Relatório de Cobertura

Para rodar a suíte completa e gerar o relatório detalhado de cobertura de código (*code coverage*):

```bash
npm run test:coverage
```

O comando executará o Jest com o coletor de cobertura ativo e validará os thresholds mínimos configurados de **50%**.

---

## 🧪 4. Explicação dos Testes Criados

A suíte segue rigorosamente o padrão **AAA (Arrange, Act, Assert)** e foi dividida em camadas estratégicas:

### 4.1. Funções Utilitárias (`src/utils`)
- **`formatPrice`**: Testa a formatação de valores monetários com 2 casas decimais por padrão, formatação com quantidade personalizada de decimais e casos especiais com valores inteiros ou zero.
- **`formatChange`**: Testa a adição do prefixo `+` para variações positivas e zero, manutenção do sinal `-` para variações negativas e arredondamento correto para 2 casas decimais.

### 4.2. Estado Global e Persistência (`src/context/AlertProvider`)
- **`useAlertProviderState`**:
  - Hidratação inicial a partir do `@react-native-async-storage/async-storage` (com dados previamente gravados ou lista vazia).
  - Adição de novos alertas (`addAlert`) gerando `id` e `createdAt` únicos e persistindo no storage via `setItem`.
  - Remoção de alertas (`deleteAlert`) por ID e sincronização com o storage.
- **`useAlerts` e `AlertProvider`**:
  - Lançamento obrigatório de exceção quando o hook `useAlerts` é consumido fora de um `AlertProvider`.
  - Disponibilização correta do contexto para componentes filhos encapsulados.

### 4.3. Hooks de Telas e Regras de Negócio (`src/screens`)
- **`useConversionScreen`**:
  - Conversão em tempo real entre criptomoedas selecionadas e moedas fiduciárias (USD, BRL, EUR, etc.).
  - Validação de entradas numéricas, identificação de entradas inválidas (textos ou números `<= 0`) e controle dos estados `showPlaceholder` e `showInvalid`.
  - Tratamento de sucesso e fallback em falhas de requisição à API.
- **`useCreateAlertScreen`**:
  - Validação de campos obrigatórios (seleção da moeda e preenchimento de preço alvo).
  - Validação de preços não numéricos ou `<= 0`.
  - Seleção de condição (`above` / `below`).
  - Chamada da função `addAlert` com payload formatado e redirecionamento de tela com `router.replace('/alerts')`.
  - Navegação reversa via `goBack()` com `router.back()`.
- **`useCryptoListScreen`**:
  - Ciclo de vida da listagem com estados: `loading`, `idle`, `empty` e `error`.
  - Uso de dados de fallback estáticos em caso de falha de rede.
  - Função `handleRetry()` para novas tentativas de carregamento.
- **`usePriceAlertsScreen`**:
  - Exibição de alertas cadastrados, disparo de exclusão e navegação para tela de criação com `router.push('/alerts/create')`.

### 4.4. Componentes Visuais e Auxiliares (`src/components` e `src/data`)
- **`PrimaryButton`**: Testes de renderização com rótulo, ícones à esquerda, disparos do callback `onPress` e bloqueio de cliques quando `disabled`.
- **`AlertCard`**: Renderização dos detalhes do alerta (moeda, preço, condição) e disparo do botão de exclusão.
- **`ConditionOptionRow`**: Seleção de opções tipo rádio (`above` / `below`) e aplicação de estilos para item ativo.
- **`CryptoCard`**: Renderização de cotações, variações percentuais coloridas e expansão interativa do painel de alertas da moeda.
- **`SelectField`**: Formatação do rótulo exibido, abertura/fechamento do modal de seleção e retorno do valor selecionado.
- **`EmptyState`**, **`ErrorState`**, **`LoadingState`** e **`ScreenHeader`**: Renderização de mensagens, estados visuais e callbacks de ação/retry/voltar.
- **`cryptoData`**: Testes da função `fetchCryptocurrenciesFromApi`, validação dos parâmetros de query, inclusão de headers de autenticação quando disponíveis e tratamento de status de erro HTTP.

---

## 📈 5. Resumo do Relatório de Cobertura

O projeto exige **obrigatoriamente 50% de cobertura mínima**. Os resultados obtidos superaram amplamente esse requisito:

### 🏆 Indicadores Gerais

| Métrica | Cobertura Obtida | Requisito Mínimo | Status |
| :--- | :---: | :---: | :---: |
| **Statements (% Stmts)** | **88.70%** | 50.00% | ✅ Superado (+38.7%) |
| **Branches (% Branch)** | **74.84%** | 50.00% | ✅ Superado (+24.8%) |
| **Functions (% Funcs)** | **81.91%** | 50.00% | ✅ Superado (+31.9%) |
| **Lines (% Lines)** | **88.01%** | 50.00% | ✅ Superado (+38.0%) |

### 📋 Tabela Detalhada por Arquivo

```text
-------------------------------|---------|----------|---------|---------|-------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------------|---------|----------|---------|---------|-------------------
All files                      |   88.70 |    74.84 |   81.91 |   88.01 |                   
 components/AlertCard          |  100.00 |   100.00 |  100.00 |  100.00 |                   
  AlertCard.tsx                |  100.00 |   100.00 |  100.00 |  100.00 |                   
  useAlertCard.ts              |  100.00 |   100.00 |  100.00 |  100.00 |                   
 components/ConditionOptionRow |  100.00 |   100.00 |  100.00 |  100.00 |                   
  ConditionOptionRow.tsx       |  100.00 |   100.00 |  100.00 |  100.00 |                   
  useConditionOptionRow.ts     |  100.00 |   100.00 |  100.00 |  100.00 |                   
 components/CryptoCard         |  100.00 |    85.71 |  100.00 |  100.00 |                   
  CryptoCard.tsx               |  100.00 |    88.23 |  100.00 |  100.00 | 37,76             
  useCryptoCard.ts             |  100.00 |    75.00 |  100.00 |  100.00 | 12                
 components/EmptyState         |  100.00 |   100.00 |  100.00 |  100.00 |                   
  EmptyState.tsx               |  100.00 |   100.00 |  100.00 |  100.00 |                   
  useEmptyState.ts             |  100.00 |   100.00 |  100.00 |  100.00 |                   
 components/ErrorState         |  100.00 |   100.00 |  100.00 |  100.00 |                   
  ErrorState.tsx               |  100.00 |   100.00 |  100.00 |  100.00 |                   
  useErrorState.ts             |  100.00 |   100.00 |  100.00 |  100.00 |                   
 components/LoadingState       |  100.00 |   100.00 |  100.00 |  100.00 |                   
  LoadingState.tsx             |  100.00 |   100.00 |  100.00 |  100.00 |                   
  useLoadingState.ts           |  100.00 |   100.00 |  100.00 |  100.00 |                   
 components/PrimaryButton      |  100.00 |    84.61 |  100.00 |  100.00 |                   
  PrimaryButton.tsx            |  100.00 |    81.81 |  100.00 |  100.00 | 33                
  usePrimaryButton.ts          |  100.00 |   100.00 |  100.00 |  100.00 |                   
 components/ScreenContainer    |  100.00 |   100.00 |  100.00 |  100.00 |                   
  ScreenContainer.tsx          |  100.00 |   100.00 |  100.00 |  100.00 |                   
 components/ScreenHeader       |  100.00 |   100.00 |  100.00 |  100.00 |                   
  ScreenHeader.tsx             |  100.00 |   100.00 |  100.00 |  100.00 |                   
  useScreenHeader.ts           |  100.00 |   100.00 |  100.00 |  100.00 |                   
 components/SelectField        |   72.22 |    30.76 |   60.00 |   66.66 |                   
  SelectField.tsx              |    0.00 |     0.00 |    0.00 |    0.00 | 29-75             
  useSelectField.ts            |  100.00 |   100.00 |  100.00 |  100.00 |                   
 context/AlertProvider         |  100.00 |    90.00 |   93.33 |  100.00 |                   
  AlertProvider.tsx            |  100.00 |   100.00 |  100.00 |  100.00 |                   
  useAlertProvider.ts          |  100.00 |    90.00 |   92.85 |  100.00 | 49                
 data                          |  100.00 |   100.00 |  100.00 |  100.00 |                   
  cryptoData.ts                |  100.00 |   100.00 |  100.00 |  100.00 |                   
 screens/ConversionScreen      |   94.44 |    70.37 |   91.66 |   93.54 |                   
  ConversionScreen.tsx         |    0.00 |     0.00 |    0.00 |    0.00 | 21-23             
  useConversionScreen.ts       |  100.00 |    90.47 |  100.00 |  100.00 | 21,39             
 screens/CreateAlertScreen     |   90.90 |    75.00 |   87.50 |   93.10 |                   
  CreateAlertScreen.tsx        |    0.00 |     0.00 |    0.00 |    0.00 | 23-25             
  useCreateAlertScreen.ts      |   96.77 |    93.75 |  100.00 |  100.00 | 37                
 screens/CryptoListScreen      |   82.60 |    33.33 |   57.14 |   82.60 |                   
  CryptoListScreen.tsx         |    0.00 |     0.00 |    0.00 |    0.00 | 12-42             
  useCryptoListScreen.ts       |  100.00 |   100.00 |  100.00 |  100.00 |                   
 screens/PriceAlertsScreen     |   50.00 |     0.00 |   40.00 |   50.00 |                   
  PriceAlertsScreen.tsx        |    0.00 |     0.00 |    0.00 |    0.00 | 11-45             
  usePriceAlertsScreen.ts      |  100.00 |   100.00 |  100.00 |  100.00 |                   
 theme                         |  100.00 |   100.00 |  100.00 |  100.00 |                   
  colors.ts                    |  100.00 |   100.00 |  100.00 |  100.00 |                   
 utils                         |  100.00 |   100.00 |  100.00 |  100.00 |                   
  index.ts                     |  100.00 |   100.00 |  100.00 |  100.00 |                   
-------------------------------|---------|----------|---------|---------|-------------------
```

---

## 📱 6. Execução da Aplicação

Caso deseje rodar a aplicação em ambiente de desenvolvimento Expo:

```bash
npx expo start
```
