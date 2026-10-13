# Configuração no Windows: Chrome kiosk e impressão automática

Este guia documenta a abordagem utilizada **em um cliente real** da primeira versão do **1Pedido**, construída com WordPress e MyD Delivery. O operador abria um **atalho personalizado do Chrome** que já carregava o painel de pedidos; o JavaScript presente nessa página identificava novos pedidos e acionava o botão de impressão.

> **Projeto legado.** Os comandos abaixo são exemplos para reproduzir a abordagem, não uma cópia exata do atalho usado no cliente. Não há garantia de compatibilidade com versões atuais do Chrome ou MyD Delivery.

## 1. Pré-requisitos

- Computador Windows autorizado a operar o painel administrativo.
- Chrome instalado, impressora configurada como padrão do Windows, drivers e papel adequados.
- Conta autorizada no painel de pedidos do WordPress/MyD Delivery.
- Um mecanismo autorizado para incluir o script **somente no painel administrativo de pedidos**.

Antes de tudo, faça uma impressão manual de teste e verifique se o painel funciona normalmente.

## 2. Criar um atalho dedicado

1. Na área de trabalho do Windows, crie um atalho para o Google Chrome.
2. Abra **Propriedades → Atalho → Destino**.
3. Utilize uma estrutura como esta (ajuste a instalação e o endereço do painel):

~~~text
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --kiosk-printing "https://exemplo.com.br/wp-admin/"
~~~

4. Substitua a URL pelo caminho **real do painel de pedidos**, não necessariamente apenas `/wp-admin/`.
5. Feche todas as janelas do Chrome e abra o atalho para testar. Instâncias existentes podem fazer o navegador ignorar parte dos argumentos.

| Argumento | Função |
| --- | --- |
| `--kiosk` | Abre o navegador em uma interface dedicada/tela cheia. |
| `--kiosk-printing` | Permite imprimir sem exibir a janela de confirmação quando a versão e o ambiente oferecem suporte. |

**Importante:** `--kiosk` sozinho **não** ativa impressão silenciosa. Verifique a configuração real da impressora, do Chrome e do Windows.

## 3. Carregar o JavaScript

O arquivo [auto-print.js](../auto-print.js) preserva o código como um bloco HTML com `<script> ... </script>`. Portanto, **não** deve ser usado sem adaptação como arquivo JavaScript externo em `<script src="...">`.

A instalação original dependia de o código ser incluído no painel; este repositório **não fornece instalador, extensão ou plugin WordPress**. Antes de ativar em um ambiente novo:

- Escolha um método de inclusão que funcione na **área administrativa**, com autorização e backup. Plugins de scripts voltados ao frontend podem não funcionar no `wp-admin`.
- Evite carregar o código duas vezes na mesma página.
- Carregue antes de `DOMContentLoaded`, evento que inicia a implementação original.
- Confirme que a interface ainda utiliza os seletores CSS indicados em [notas técnicas](NOTAS-TECNICAS.md).
- Não inclua credenciais, cookies ou dados de pedidos reais na documentação ou no atalho.

## 4. Validar o funcionamento

1. Abra o atalho e confirme que o painel correto aparece com sessão autorizada.
2. Certifique-se de que pedidos já listados **não** sejam disparados novamente ao iniciar.
3. Faça um pedido de teste: confirme qual pedido foi aberto e qual comprovante saiu na impressora.
4. Faça dois pedidos em sequência rápida: a versão original **pode sobrepor cliques e impressões**; só considere o teste aprovado após verificar cada comprovante.
5. Recarregue a página e repita; o controle de pedidos é mantido apenas na memória da aba.
6. Teste impressora desligada ou sem papel: o script aciona um botão, mas **não confirma impressão física**.
7. Mantenha uma alternativa manual caso a automação falhe.

## 5. Diagnóstico rápido

| Sintoma | Verificar |
| --- | --- |
| Abre painel, mas não imprime | Se o script foi carregado no painel, se o DOM ainda corresponde aos seletores e se o botão aparece. |
| Janela de impressão aparece | Aplicação de `--kiosk-printing`, reinício completo do Chrome, impressora padrão e compatibilidade. |
| Nada acontece | Erros no console, `DOMContentLoaded` já disparado quando o script é carregado ou elementos ausentes. |
| Pedido duplicado/incorreto | Pedidos simultâneos, recarregamento, datas e mudanças no painel. |

**Registro histórico:** foi confirmado o uso de um **atalho personalizado aberto pelo operador**, não a inicialização automática do Chrome junto com o Windows.
