<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function () {
    let pedidosImpressos = new Set();
    let pedidosJaListados = new Set();
    let ultimaHoraPedidoImpresso = 0;

    function iniciarMonitoramento() {
        const listaPedidos = document.querySelector('.fdm-orders-list');

        if (listaPedidos) {
            const pedidos = listaPedidos.querySelectorAll('.fdm-orders-items');

            for (let pedido of pedidos) {
                const orderId = pedido.getAttribute('id');
                const dataHoraPedido = obterDataHoraPedido(pedido);
                pedidosJaListados.add(orderId);
                console.log(`Pedido já listado: ${orderId} - Data: ${dataHoraPedido}`);
            }

            setInterval(monitorarNovosPedidos, 5000);
        }
    }

    function monitorarNovosPedidos() {
        const listaPedidos = document.querySelector('.fdm-orders-list');

        if (listaPedidos) {
            const pedidos = listaPedidos.querySelectorAll('.fdm-orders-items');
            let novosPedidos = [];

            for (let pedido of pedidos) {
                const orderId = pedido.getAttribute('id');
                const dataHoraPedido = obterDataHoraPedido(pedido);

                if (dataHoraPedido > ultimaHoraPedidoImpresso && !pedidosImpressos.has(orderId) && !pedidosJaListados.has(orderId)) {
                    novosPedidos.push(orderId);
                    console.log(`Novo pedido encontrado: ${orderId} - Data: ${dataHoraPedido}`);
                }
            }

            if (novosPedidos.length > 0) {
                for (let orderId of novosPedidos) {
                    const pedido = Array.from(pedidos).find(p => p.getAttribute('id') === orderId);
                    const dataHoraPedido = obterDataHoraPedido(pedido);

                    pedido.click();

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
