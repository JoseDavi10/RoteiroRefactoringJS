function gerarFaturaStr(fatura, pecas) {
  const formato = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
}).format;
  // função extraída para calcular o total de uma apresentação
  function calcularTotalApresentacao(apre, peca) {
      let total = 0;
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

  let totalFatura = 0;
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  

  for (let apre of fatura.apresentacoes) {
      const peca = pecas[apre.id];
      let total = calcularTotalApresentacao(apre, peca);
      totalFatura += total;

      // Cálculo dos créditos
      creditos += Math.max(apre.audiencia - 30, 0);
      if (peca.tipo === "comedia") creditos += Math.floor(apre.audiencia / 5);

      // Adiciona a linha da apresentação na string da fatura
      faturaStr += `  ${peca.nome}: ${formato(total / 100)} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formato(totalFatura / 100)}\n`;
  faturaStr += `Créditos acumulados: ${creditos}\n`;
  return faturaStr;
}