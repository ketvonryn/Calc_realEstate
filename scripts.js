/// listener no botao
document.getElementById("calcular").addEventListener("click", pegarValores)

//----------------------------------------------------------------------------------------------------------
// aplica mascaras nos inputs e filtra os dados antes de armazena-los
function formatarMoeda(input) {

}

function formatarInteiro(input) {
    // Atualiza o valor do input apenas com números inteiros, ZERA SE NECESSESARIO
    input.value = Math.floor(Number(input.value));  // Arredondar para baixo, se necessário
}

function formatarPorcentagem(input) {
    // TO DO
}
//----------------------------------------------------------------------------------------------------------


//receber e armazenar os dados
function pegarValores() {
    let valEmp = document.getElementById("valor").value
    let Parc = document.getElementById("parc").value
    let tpTx = document.querySelector('input[name="tpTx"]:checked').value === "aa"; //retorna TRUE para ao ano e FALSE para ao mes
    let tpAmort = document.querySelector('input[name="tpAmort"]:checked').value === "sac"; //retorna TRUE para SAC e FALSE para PRICE
    let tx = document.getElementById("taxa").value
    let Amort = document.getElementById("amort").value

    //verifica se os campos obrigatorios foram preenhidos
    if (!valEmp || !Parc || !tx) {
        let texto = document.createTextNode("** Preencha os campos obrigatórios **"); document.getElementById("btn").appendChild(texto)
        let cor = document.querySelector("#obg")
        cor.style.color = "red"
        cor.style.fontWeight = "bold";
    } else {
        //arrumamos a taxa para decimal
        tx = (tx / 100)
        //verifica se o valor do tpTx esta em ano e converte para meses
        if (tpTx) { // se for true (ao ano), converteremos  em meses - valor em decimal
            tx = ((1 + tx) ** (1 / 12)) - 1
        }
        //verifica se Amort tem valor, se for vazio add zero
        if (!Amort) {
            Amort = 0;
        }
        Amort = Number(Amort)
        // envia dados para Calculo

        //VERIFICA SE SAC OU PRICE
        if (tpAmort) {
            CalculoSAC(valEmp, Parc, tx, Amort)
        } else {
            CalculoPRICE(valEmp, Parc, tx, Amort)
        }
    }
}
function CalculoPRICE(valEmp, parc, tx, Amort) {
    //seleciona e limpa o campo da resposta
    result = document.getElementById("resultado");
    result.innerHTML = '';
    // Cria o elemento tabela com id "result"
    novaTabela = document.createElement('table');
    novaTabela.id = "result";
    result.appendChild(novaTabela);

    // Cria abeçalho da tabela
    var cabecalho = novaTabela.createTHead();
    var linhaCabecalho = cabecalho.insertRow();
    var colNumParcela = linhaCabecalho.insertCell(0);
    var colValorParcela = linhaCabecalho.insertCell(1);
    var colJuros = linhaCabecalho.insertCell(2);
    var colAmortizacao = linhaCabecalho.insertCell(3);
    var colSaldoDevedor = linhaCabecalho.insertCell(4);
    // preenche cabecalho com dados
    colNumParcela.textContent = "Número da Parcela";
    colValorParcela.textContent = "Valor da Parcela";
    colJuros.textContent = "Juros";
    colAmortizacao.textContent = "Amortizações";
    colSaldoDevedor.textContent = "Saldo Devedor";

    // Variáveis iniciais para soma no final
    var totalValorParcela = 0;
    var totalAmortizacao = 0;
    var totalJuros = 0;
    var saldoDevedor = valEmp;

    // Loop para calcular cada linha de parcelas 
    for (let i = 1; (i <= parc) && (saldoDevedor > 0); i++) {
        //cria uma nova linha na tabela
        let novaLinha = novaTabela.insertRow();

        //cria a celula 1 - NUMERO DE PARCELA
        let celNumParcela = novaLinha.insertCell(0);
        celNumParcela.textContent = i // preenche celula 1

        //cria a celula 2 - VALOR DA PARCELA
        let celValorParcela = novaLinha.insertCell(1);
        let fator = ((1 + tx) ** (parc - i + 1)); // fator é para evitar repetir duas vezes o valor na fórmula
        var valorParcela = (saldoDevedor * fator * tx) / (fator - 1) + (i < parc ? Amort : 0); // Adiciona Amortização apenas se não for a última parcela
        celValorParcela.textContent = valorParcela.toFixed(2); // preenche a célula
        totalValorParcela += valorParcela; // soma para mostrar no final


        //cria celula 3 - JUROS
        let celJuros = novaLinha.insertCell(2);
        var valJuros = saldoDevedor * tx //calculo
        celJuros.textContent = valJuros.toFixed(2) //preenche a celula
        totalJuros += valJuros // soma para mostrar no final

        //cria celula 4 - AMORTIZACOES
        let celAmortizacao = novaLinha.insertCell(3);
        var valorAmort = (valorParcela - valJuros) //calcula
        celAmortizacao.textContent = parseFloat(valorAmort).toFixed(2) // preenche a celula
        totalAmortizacao += valorAmort; // soma para mostrar no final

        //cria celula 5 - SALDO DEVEDOR
        let celSaldoDevedor = novaLinha.insertCell(4);
        saldoDevedor -= valorAmort// calcula
        celSaldoDevedor.textContent = parseFloat(saldoDevedor).toFixed(2) //preenche
    }

    // Adiciona a última linha "TOTAL" na tabela
    let linhaTotal = novaTabela.insertRow();
    let celulaTotal = linhaTotal.insertCell(0); celulaTotal.textContent = "Total pago >>";
    let celValorParcela = linhaTotal.insertCell(1);
    let celJuros = linhaTotal.insertCell(2); celJuros.textContent = totalJuros.toFixed(2);
    let celAmortizacao = linhaTotal.insertCell(3); celAmortizacao.textContent = parseFloat(totalAmortizacao).toFixed(2);
    let celSaldoDevedor = linhaTotal.insertCell(4); celSaldoDevedor.textContent = "<< <<";

    //se o ultimo saldo devedor for negativo, deduz ele no valor pago nas parcelas
    if (saldoDevedor < 0) {
        celValorParcela.textContent = (totalValorParcela + saldoDevedor).toFixed(2);
    } else {
        celValorParcela.textContent = totalValorParcela.toFixed(2);
    }
}
function CalculoSAC(valEmp, parc, tx, Amort) {
    // Seleciona e limpa o campo da resposta
    result = document.getElementById("resultado");
    result.innerHTML = '';
    // Cria o elemento tabela com id "result"
    novaTabela = document.createElement('table');
    novaTabela.id = "result";
    result.appendChild(novaTabela);

    // Cria cabeçalho da tabela
    var cabecalho = novaTabela.createTHead();
    var linhaCabecalho = cabecalho.insertRow();
    var colNumParcela = linhaCabecalho.insertCell(0);
    var colValorParcela = linhaCabecalho.insertCell(1);
    var colJuros = linhaCabecalho.insertCell(2);
    var colAmortizacao = linhaCabecalho.insertCell(3);
    var colSaldoDevedor = linhaCabecalho.insertCell(4);
    // Preenche cabeçalho com dados
    colNumParcela.textContent = "Número da Parcela";
    colValorParcela.textContent = "Valor da Parcela";
    colJuros.textContent = "Juros";
    colAmortizacao.textContent = "Amortizações";
    colSaldoDevedor.textContent = "Saldo Devedor";

    // Variáveis iniciais para soma no final
    var totalValorParcela = 0;
    var totalAmortizacao = 0;
    var totalJuros = 0;
    var saldoDevedor = valEmp;

    // Cálculo da amortização constante
    var amortizacao = (valEmp / parc) + Amort;

    // Loop para calcular cada linha de parcelas 
    for (let i = 1; (i <= parc) && (saldoDevedor > 0); i++) {
        // Cria uma nova linha na tabela
        let novaLinha = novaTabela.insertRow();

        // Cria a célula 1 - NÚMERO DE PARCELA
        let celNumParcela = novaLinha.insertCell(0);
        celNumParcela.textContent = i; // Preenche célula 1

        // Cria a célula 2 - VALOR DA PARCELA
        let celValorParcela = novaLinha.insertCell(1);
        var valorParcela = amortizacao + saldoDevedor * tx; // Calcula o valor da parcela
        celValorParcela.textContent = valorParcela.toFixed(2); // Preenche a célula
        totalValorParcela += valorParcela; // Soma para mostrar no final

        // Cria célula 3 - JUROS
        let celJuros = novaLinha.insertCell(2);
        var valJuros = saldoDevedor * tx; // Cálculo dos juros
        celJuros.textContent = valJuros.toFixed(2); // Preenche a célula
        totalJuros += valJuros; // Soma para mostrar no final

        // Cria célula 4 - AMORTIZAÇÕES
        let celAmortizacao = novaLinha.insertCell(3);
        celAmortizacao.textContent = amortizacao.toFixed(2); // Preenche a célula
        totalAmortizacao += amortizacao; // Soma para mostrar no final

        // Cria célula 5 - SALDO DEVEDOR
        let celSaldoDevedor = novaLinha.insertCell(4);
        saldoDevedor -= amortizacao; // Cálculo do saldo devedor
        celSaldoDevedor.textContent = saldoDevedor.toFixed(2); // Preenche a célula
    }

    // Adiciona a última linha "TOTAL" na tabela
    let linhaTotal = novaTabela.insertRow();
    let celulaTotal = linhaTotal.insertCell(0); celulaTotal.textContent = "Total pago >>";
    let celValorParcela = linhaTotal.insertCell(1);
    let celJuros = linhaTotal.insertCell(2); celJuros.textContent = totalJuros.toFixed(2);
    let celAmortizacao = linhaTotal.insertCell(3); celAmortizacao.textContent = parseFloat(totalAmortizacao).toFixed(2);
    let celSaldoDevedor = linhaTotal.insertCell(4); celSaldoDevedor.textContent = "<< <<";

    // Se o último saldo devedor for negativo, deduz ele no valor pago nas parcelas
    if (saldoDevedor < 0) {
        celValorParcela.textContent = (totalValorParcela + saldoDevedor).toFixed(2);
    } else {
        celValorParcela.textContent = totalValorParcela.toFixed(2);
    }
}