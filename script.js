async function consultarAr() {
  const inputCidade = document.getElementById("cidade");
  const cidade = inputCidade.value.trim();
  const resultado = document.getElementById("resultado");

  if (!cidade) {
    resultado.innerHTML = "<span class='ruim'>⚠️ Por favor, digite uma cidade.</span>";
    return;
  }

  resultado.innerHTML = "⏳ Buscando dados...";

  try {
    const resposta = await fetch(`https://api.api-ninjas.com/v1/airquality?city=${encodeURIComponent(cidade)}`, {
      headers: {
        "X-Api-Key": "COLOQUE_SUA_API_AQUI" // 🔐 Substitua por sua chave real
      }
    });

    if (!resposta.ok) {
      throw new Error("Erro na resposta da API");
    }

    const dados = await resposta.json();

    // Funções de classificação
    function classificarPM25(valor) {
      if (valor <= 12) return { texto: "Ótimo ✅", cor: "otimo" };
      if (valor <= 35.4) return { texto: "Regular ⚠️", cor: "regular" };
      return { texto: "Ruim ❌", cor: "ruim" };
    }

    function classificarNO2(valor) {
      if (valor <= 100) return { texto: "Ótimo ✅", cor: "otimo" };
      if (valor <= 200) return { texto: "Regular ⚠️", cor: "regular" };
      return { texto: "Ruim ❌", cor: "ruim" };
    }

    function classificarO3(valor) {
      if (valor <= 120) return { texto: "Ótimo ✅", cor: "otimo" };
      if (valor <= 180) return { texto: "Regular ⚠️", cor: "regular" };
      return { texto: "Ruim ❌", cor: "ruim" };
    }

    const pm25 = classificarPM25(dados["PM2.5"].concentration);
    const no2 = classificarNO2(dados["NO2"].concentration);
    const o3 = classificarO3(dados["O3"].concentration);

    resultado.innerHTML = `
      <h3>🌎 Qualidade do ar em <strong>${cidade}</strong></h3>

      <p><strong>Índice Geral (AQI):</strong> <span class="destaque">${dados.overall_aqi}</span> — quanto menor, melhor.</p>

      <p><strong>Partículas finas (PM2.5):</strong> ${dados["PM2.5"].concentration} µg/m³<br>
      <span class="classificacao ${pm25.cor}">${pm25.texto}</span><br>
      <small>Penetram nos pulmões e podem afetar a saúde respiratória.</small></p>

      <p><strong>Dióxido de Nitrogênio (NO₂):</strong> ${dados["NO2"].concentration} µg/m³<br>
      <span class="classificacao ${no2.cor}">${no2.texto}</span><br>
      <small>Gás comum em áreas urbanas com tráfego intenso. Pode causar irritações.</small></p>

      <p><strong>Ozônio ao nível do solo (O₃):</strong> ${dados["O3"].concentration} µg/m³<br>
      <span class="classificacao ${o3.cor}">${o3.texto}</span><br>
      <small>Em excesso, pode causar desconforto respiratório e afetar grupos sensíveis.</small></p>
    `;

  } catch (erro) {
    console.error(erro);
    resultado.innerHTML = `<span class="ruim">❌ Erro ao acessar os dados: ${erro.message}</span>`;
  }
}