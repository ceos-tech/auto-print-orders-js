# Notas técnicas: implementação histórica

Estas notas descrevem uma **revisão estática** do [auto-print.js](../auto-print.js), usado em um cliente real da primeira versão do 1Pedido. O código original foi **preservado**. Não houve teste de compatibilidade com as versões atuais de WordPress, MyD Delivery ou Chrome.

## Fluxo identificado no código

1. Aguarda o evento `DOMContentLoaded`.
2. Localiza `.fdm-orders-list` e registra como conhecidos os pedidos `.fdm-orders-items` já carregados.
3. Inicia uma verificação periódica com `setInterval(..., 5000)`.
4. Identifica novos IDs de pedidos que passaram pelas verificações de data e não estão nos conjuntos em memória.
5. Clica no pedido detectado e, **3 segundos depois**, procura o botão `#fdm-print-order` e o aciona se estiver visível.
6. Registra o pedido como impresso **após clicar no botão**. Não recebe confirmação do spooler nem da impressora.

## Dependências de interface

| Seletor | Uso no script |
| --- | --- |
| `.fdm-orders-list` | Lista de pedidos |
| `.fdm-orders-items` | Linha de pedido; o atributo `id` identifica o registro |
| `.fdm-order-list-items-date` | Texto de data/hora do pedido |
| `#fdm-print-order` | Botão de impressão do painel |
| `.fdm-orders-loop` | Contêiner do listener para cliques manuais |

A automação **não utiliza API de impressão oficial**; depende da estrutura do HTML do plugin. Atualizações podem quebrá-la.

## Limitações reais da versão original

- **Concorrência:** quando vários pedidos chegam juntos, cada um agenda sua própria ação após 3 segundos. A interface pode estar mostrando outro pedido quando o clique de impressão ocorrer.
- **Sem persistência:** `pedidosImpressos`, `pedidosJaListados` e a última data são variáveis da página, redefinidas após recarregar/abrir a aba.
- **Datas frágeis:** o parser espera um formato próximo de `DD/MM - HH:mm` e utiliza o ano atual.
- **Sem confirmação:** o clique no botão não prova que o papel foi impresso; não há fila de retentativas.
- **Dependência de carregamento:** se a inclusão acontecer após `DOMContentLoaded`, a inicialização poderá não rodar.
- **Elementos ausentes:** o listener em `.fdm-orders-loop` presume que esse nó exista.
- **Formato do arquivo:** `auto-print.js` contém tags HTML `<script>`; precisa de adaptação antes de ser usado como arquivo `.js` externo.

Esses são **riscos do código**, não afirmações de problemas ocorridos na operação do cliente.

## Melhorias possíveis em uma evolução futura

- Processamento sequencial com fila, para evitar sobreposição de pedidos.
- Identificação estável de pedido e controle persistente de tarefas.
- Tratamento de falhas e retorno explícito da impressora.
- Inicialização tolerante a carregamento tardio e verificações de elementos ausentes.
- Preferência por API/eventos oficiais quando houver suporte.

Nenhuma dessas melhorias foi incluída nesta atualização, justamente para **não modificar o comportamento histórico da solução**.

## Checklist de homologação

- [ ] Acesso autorizado ao painel pelo atalho dedicado.
- [ ] Impressora padrão e impressão silenciosa testadas.
- [ ] Pedido novo imprime o documento correto.
- [ ] Pedidos existentes não são impressos indevidamente.
- [ ] Pedidos simultâneos não causam trocas ou duplicações.
- [ ] Reinício, sessão expirada e atualização de página são tratados operacionalmente.
- [ ] Falha de impressora pode ser percebida por uma pessoa responsável.
- [ ] Nenhuma credencial ou informação privada é exposta.

**Créditos:** CEOS Tech / primeiro 1Pedido. Projeto independente, sem afiliação oficial ao MyD Delivery.
