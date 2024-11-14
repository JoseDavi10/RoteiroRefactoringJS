function gerarFaturaStr(fatura, pecas) {

    // função query para obter a peça
    function getPeca(apresentacao) {
        return pecas[apresentacao.id];
    }

    // função para calcular o total de uma apresentação
    function calcularTotalApresentacao(apre) {
        let total = 0;
        const peca = getPeca(apre);
        switch (peca.tipo) {
            case "tragedia":
                total = 40000;
                if (apre.audiencia > 30) {
                    total += 1000 * (apre.audiencia - 30);
                }
                break;
            case "comedia":
                total = 30000;
                if (apre.audiencia > 20) {
                    total += 10000 + 500 * (apre.audiencia - 20);
                }
                total += 300 * apre.audiencia;
                break;
            default:
                throw new Error(`Peça desconhecida: ${peca.tipo}`);
        }
        return total;
    }

    // ffunção extraída para calcular créditos de uma apresentação
    function calcularCredito(apre) {
        let creditos = Math.max(apre.audiencia - 30, 0);
        if (getPeca(apre).tipo === "comedia") 
            creditos += Math.floor(apre.audiencia / 5);
        return creditos;
    }

    // função extraída para formatar o valor em moeda
    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2
        }).format(valor / 100);
    }

    // função para formatar cada apresentação na fatura
    function formatarApresentacao(apre) {
        const total = calcularTotalApresentacao(apre);
        return `  ${getPeca(apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
    }

    let totalFatura = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;

    for (let apre of fatura.apresentacoes) {
        const totalApresentacao = calcularTotalApresentacao(apre);
        totalFatura += totalApresentacao;
        creditos += calcularCredito(apre);
        faturaStr += formatarApresentacao(apre);
    }

    faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
    faturaStr += `Créditos acumulados: ${creditos}\n`;
    return faturaStr;
}
