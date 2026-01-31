<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function () {
     // Conjuntos para controlar pedidos processados
    let pedidosImpressos = new Set();
    let pedidosJaListados = new Set();
    let ultimaHoraPedidoImpresso = 0;

    // Função inicial que carrega pedidos existentes e inicia monitoramento
    function iniciarMonitoramento() {
        const listaPedidos = document.querySelector('.fdm-orders-list');

        if (listaPedidos) {
            const pedidos = listaPedidos.querySelectorAll('.fdm-orders-items');
            // Marca pedidos que já estavam na lista
            for (let pedido of pedidos) {
                const orderId = pedido.getAttribute('id');
                const dataHoraPedido = obterDataHoraPedido(pedido);
                pedidosJaListados.add(orderId);
                console.log(`Pedido já listado: ${orderId} - Data: ${dataHoraPedido}`);
            }
            // Monitora novos pedidos a cada 5 segundos
            setInterval(monitorarNovosPedidos, 5000);
        }
    }
    // Função que identifica e imprime novos pedidos
    function monitorarNovosPedidos() {
        const listaPedidos = document.querySelector('.fdm-orders-list');

        if (listaPedidos) {
            const pedidos = listaPedidos.querySelectorAll('.fdm-orders-items');
            let novosPedidos = [];
            // Verifica pedidos que ainda não foram impressos nem listados
            for (let pedido of pedidos) {
                const orderId = pedido.getAttribute('id');
                const dataHoraPedido = obterDataHoraPedido(pedido);

                if (dataHoraPedido > ultimaHoraPedidoImpresso && !pedidosImpressos.has(orderId) && !pedidosJaListados.has(orderId)) {
                    novosPedidos.push(orderId);
                    console.log(`Novo pedido encontrado: ${orderId} - Data: ${dataHoraPedido}`);
                }
            }
            // Para cada novo pedido, abre e imprime
            if (novosPedidos.length > 0) {
                for (let orderId of novosPedidos) {
                    const pedido = Array.from(pedidos).find(p => p.getAttribute('id') === orderId);
                    const dataHoraPedido = obterDataHoraPedido(pedido);

                    pedido.click();
                    // Aguardar botão de impressão aparecer
                    setTimeout(function () {
                        const botaoImprimir = document.getElementById('fdm-print-order');

                        if (botaoImprimir && botaoImprimir.offsetParent !== null) {
                            botaoImprimir.click();

                            pedidosImpressos.add(orderId);
                            ultimaHoraPedidoImpresso = dataHoraPedido;
                            console.log(`Pedido impresso: ${orderId} - Data: ${dataHoraPedido}`);
                        } else {
                            console.log("Botão de impressão não encontrado ou não visível");
                        }
                    }, 3000);
                }
            }
        }
    }
    // Função para obter timestamp do pedido
    function obterDataHoraPedido(pedido) {
        const dataElemento = pedido.querySelector('.fdm-order-list-items-date');
        if (dataElemento) {
            const dataHoraTexto = dataElemento.innerText.trim();
            const [diaMes, horaMinuto] = dataHoraTexto.split(' - ');
            const [dia, mes] = diaMes.split('/');
            const [hora, minuto] = horaMinuto.split(':');
            const anoAtual = new Date().getFullYear();
            const dataCompleta = `${anoAtual}/${mes}/${dia} ${hora}:${minuto}`;
            return new Date(dataCompleta).getTime();
        }
        return 0;
    }

    iniciarMonitoramento();
    // Listener para cliques manuais nos pedidos
    document.querySelector('.fdm-orders-loop').addEventListener('click', function(event) {
        const pedidoClicado = event.target.closest('.fdm-orders-items');

        if (pedidoClicado) {
            const orderId = pedidoClicado.getAttribute('id');

            if (!pedidosImpressos.has(orderId) && !pedidosJaListados.has(orderId)) {
                console.log(`Novo pedido clicado: ${orderId}`);
            } else {
                console.log(`Pedido já impresso clicado: ${orderId}`);
            }
        }
    });
});
</script>
