# Planejamento de Testes E2E com Apoio de IA Generativa

**Aplicação Alvo:** Crypto Alert (React Native / Expo Router)  
**Metodologia:** Engenharia de Prompt multi-nível inspirada na abordagem *GenIA-E2ETest*  
**Objetivo:** Levantar cenários E2E, rascunhar fluxos no padrão Maestro e realizar a análise crítica antes da automação  

---

## 1. Prompt Utilizado

Para solicitar à IA a geração dos cenários de teste, foi estruturado o seguinte prompt com atribuição de persona, contexto detalhado da aplicação, mapeamento das funcionalidades e restrições de formato:

```text
Você é um Engenheiro de Testes de Software Sênior especializado em automação End-to-End (E2E) para aplicações mobile em React Native com Expo Router e Maestro.

Analise a aplicação "Crypto Alert", que possui as seguintes características e fluxos:
1. Aba "List" (Home):
   - Exibe a lista de criptomoedas (Bitcoin, Ethereum, Solana, etc.) com preço atual em USD e variação de 24h.
   - Cada card possui imagem/avatar, nome, símbolo, preço e variação percentual.
   - Se houver alertas cadastrados para uma criptomoeda, um badge expansível ("X alerts" / "1 alert") é exibido no card, permitindo expandir e visualizar as metas de preço e condições ("Above target" ou "Below target").
2. Aba "Convert":
   - Título "Convert Crypto".
   - Campo de entrada numérica "Amount" (placeholder "0.00").
   - Campo de seleção "Cryptocurrency" (SelectField que abre Modal com a lista de criptos).
   - Campo de seleção "Fiat Currency" (SelectField que abre Modal com USD, BRL, EUR, GBP, JPY).
   - Card de resultado "Converted Amount", que exibe "Enter an amount" por padrão, "Invalid amount" se for inválido, ou o valor convertido formatado.
3. Aba "Alerts":
   - Título "Price Alerts".
   - Botão no cabeçalho "New Alert".
   - Estado vazio quando não há alertas ("No alerts yet" com botão "Create Alert").
   - Listagem de alertas cadastrados (cards com moeda, condição "above" ou "below", preço alvo e botão de exclusão com ícone de lixeira e accessibilityLabel "Delete alert").
   - Tela de criação "Create Alert" acessada pelo botão de novo alerta:
     - Header com botão voltar (accessibilityLabel "Go back").
     - Seletor de Criptomoeda (SelectField).
     - Campo de preço alvo "Target Price (USD)" com input numérico.
     - Seleção de condição tipo rádio: "Above target price" ou "Below target price".
     - Botão "Save Alert" (desabilitado até que o formulário esteja válido).
     - Ao salvar, o alerta é adicionado ao estado persistente e a tela retorna para "/alerts".

Proponha:
1. Uma lista de cenários de teste E2E essenciais para cobrir os fluxos críticos da aplicação.
2. Os passos detalhados de cada cenário (ações do usuário e asserções esperadas).
3. A indicação dos elementos de interface a serem interagidos.
```

---

## 2. Resposta Original da IA Generativa

Abaixo está a íntegra da resposta fornecida pelo modelo de linguagem:

> ### Proposta de Cenários de Testes End-to-End (E2E) para Crypto Alert
>
> Com base na arquitetura do Crypto Alert, apresento uma suíte de 6 cenários E2E para validação completa da jornada do usuário:
>
> #### Cenário 1: Navegação e Visualização da Lista de Criptomoedas
> - **Objetivo:** Validar a renderização da tela inicial com os ativos financeiros e rolagem da lista.
> - **Passos:**
>   1. Inicializar o aplicativo na tela inicial.
>   2. Verificar a exibição do título "Cryptocurrencies".
>   3. Verificar a presença dos cards das criptomoedas principais ("Bitcoin", "Ethereum").
>   4. Executar rolagem vertical para visualizar criptomoedas inferiores ("Dogecoin", "Avalanche").
>   5. Validar a formatação de preço com cifrão e variação percentual.
>
> #### Cenário 2: Conversão de Moedas em Tempo Real
> - **Objetivo:** Validar a calculadora de conversão entre criptomoedas e moedas fiduciárias.
> - **Passos:**
>   1. Tocar na aba de navegação inferior "Convert".
>   2. Validar que o título "Convert Crypto" está visível.
>   3. Confirmar que o resultado inicial exibe "Enter an amount".
>   4. Digitar o valor "2" no campo de entrada "Amount".
>   5. Tocar no seletor "Cryptocurrency", aguardar a abertura do modal e selecionar "Ethereum".
>   6. Tocar no seletor "Fiat Currency" e selecionar "BRL".
>   7. Validar que a caixa de resultado foi atualizada com o valor convertido em Reais (R$).
>   8. Apagar o valor do input e verificar retorno para "Enter an amount" ou erro "Invalid amount" com caracteres inválidos.
>
> #### Cenário 3: Criação de um Novo Alerta de Preço com Sucesso
> - **Objetivo:** Garantir o cadastro completo de um alerta disparado por condição de alta.
> - **Passos:**
>   1. Tocar na aba "Alerts".
>   2. Validar a visualização da tela "Price Alerts".
>   3. Clicar no botão "New Alert" (ou "Create Alert" no empty state).
>   4. Confirmar que a tela "Create Alert" foi aberta.
>   5. Clicar no campo "Cryptocurrency" (SelectField) e escolher "Bitcoin".
>   6. Clicar no campo "Target Price (USD)" e digitar "70000".
>   7. Garantir que a opção "Above target price" está selecionada.
>   8. Clicar no botão "Save Alert".
>   9. Verificar o redirecionamento de volta para a lista de alertas e a presença do card criado exibindo "Bitcoin", "above" e "$70,000.00".
>
> #### Cenário 4: Validação Cruzada do Alerta na Home e Exclusão do Alerta
> - **Objetivo:** Validar o impacto da criação do alerta no card da tela inicial e o fluxo de exclusão.
> - **Passos:**
>   1. Com um alerta cadastrado para Bitcoin, navegar para a aba "List".
>   2. Localizar o card do "Bitcoin" e validar a presença da badge "1 alert".
>   3. Tocar na badge para expandir os detalhes do alerta.
>   4. Validar que o texto "Above target" e o valor "$70,000.00" são exibidos.
>   5. Retornar à aba "Alerts".
>   6. Clicar no botão de exclusão do card de alerta (ícone de lixeira).
>   7. Validar que o alerta foi removido e a tela exibe o estado "No alerts yet".
>
> #### Cenário 5: Validação de Formulário e Bloqueio de Cadastro com Campos Incompletos
> - **Objetivo:** Garantir que o botão "Save Alert" permaneça desabilitado ou exiba erros com dados vazios.
> - **Passos:**
>   1. Navegar até "Alerts" -> "New Alert".
>   2. Sem preencher os campos, tentar clicar em "Save Alert" ou verificar que está inativo.
>   3. Digitar um preço inválido ("0" ou negativo) e verificar mensagem de validação.
>   4. Tocar no botão de voltar ("Go back") e confirmar retorno sem salvar nenhum alerta.
>
> #### Cenário 6: Falha de Rede e Fallback na Listagem
> - **Objetivo:** Simular ausência de conexão e validar exibição de mensagem de erro e botão de retry.
> - **Passos:**
>   1. Desconectar o dispositivo da internet.
>   2. Abrir o aplicativo e verificar o componente "ErrorState" com "Failed to load".
>   3. Clicar no botão "Retry".

---

## 3. Cenários Selecionados para Implementação com Maestro

Para a automação E2E foram selecionados **4 fluxos prioritários**, correspondentes aos cenários que abrangem todas as três abas principais, validação de regras de cálculo, persistência e ciclo completo de vida de dados:

1. **Fluxo 1 (`01_view_crypto_list.yaml`):** Visualização e Navegação na Lista de Criptomoedas (Cenário 1).
2. **Fluxo 2 (`02_convert_currency.yaml`):** Cálculo e Conversão de Moedas em Tempo Real (Cenário 2).
3. **Fluxo 3 (`03_create_price_alert.yaml`):** Cadastro de Alerta de Preço e Validação de Persistência (Cenário 3).
4. **Fluxo 4 (`04_verify_and_delete_alert.yaml`):** Integração Cruzada (Badge na Home) e Remoção de Alerta (Cenário 4).

---

## 4. Análise Crítica: O que foi Aproveitado, Corrigido ou Descartado

Em estrita consonância com os achados do artigo *GenIA-E2ETest*, a resposta da IA exigiu curadoria humana técnica para tornar os scripts executáveis e alinhados à interface real do aplicativo:

| Aspecto | Proposto pela IA | Análise Crítica e Decisão Técnica | Status |
| :--- | :--- | :--- | :--- |
| **Encadeamento de Jornadas** | Estruturação lógica dos 4 fluxos principais cobrindo navegação, conversão e alertas. | Os passos lógicos e a decomposição de ações atenderam perfeitamente aos requisitos do usuário final. | **Aproveitado integralmente** |
| **Identificadores das Abas** | Uso de seletores genéricos como `//tab[@name='List']` ou `id: tab_convert`. | O Expo Router utiliza componentes nativos do React Navigation onde o seletor mais resiliente no Maestro é o texto visível da aba (`tapOn: "List"`, `tapOn: "Convert"`, `tapOn: "Alerts"`). | **Corrigido** |
| **Campos de Seleção (SelectField)** | A IA assumiu um componente HTML tradicional `<select>` com clique direto na opção. | No app React Native, o `SelectField` é um `Pressable` que aciona um `Modal` transparente contendo uma `FlatList`. No Maestro, deve-se primeiro tocar no campo pelo seu rótulo/valor atual, aguardar a abertura do modal e então selecionar o item desejado pelo texto. | **Corrigido** |
| **Botão de Exclusão** | A IA sugeriu `tapOn: "Delete"` ou `tapOn: "trash-icon"`. | O botão de deletar no `AlertCard` não possui texto visível, sendo identificado pelo atributo de acessibilidade `accessibilityLabel="Delete alert"`. O Maestro deve utilizar `tapOn:` com o `id` correspondente ou label de acessibilidade. | **Corrigido** |
| **Botão Voltar no Cabeçalho** | A IA sugeriu comando nativo de back do sistema operacional. | O componente `ScreenHeader` possui um botão explícito de voltar estilizado com `accessibilityLabel="Go back"`, permitindo um teste mais confiável e independente do OS. | **Aproveitado e refinado** |
| **Cenário 5 (Validação de Erros)** | Teste redundante de campos vazios como um fluxo isolado. | As validações de campos obrigatórios já são verificadas implicitamente pelo estado `disabled` do botão no fluxo de criação. Criar um fluxo separado aumentaria o tempo de build sem ganho proporcional. | **Descartado para suíte principal** |
| **Cenário 6 (Simulação de Queda de Rede)** | Cenário com desconexão manual de Wi-Fi e mock de falha de API externa. | Em testes E2E executados pelo Maestro em emulador/dispositivo sem infraestrutura de mock de proxy, desativar a rede pode interferir no servidor de desenvolvimento do Metro Bundler / Expo. Foi descartado para manter os testes herméticos e determinísticos. | **Descartado** |
| **Sincronização e Delays** | A IA não incluiu tempos de espera entre transições assíncronas do AsyncStorage e animações do Modal. | Foi necessário adicionar verificações explícitas de visibilidade (`assertVisible`) e pequenas pausas de estabilização para evitar condições de corrida (*race conditions*). | **Corrigido / Adicionado** |
