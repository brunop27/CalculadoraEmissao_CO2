/**
 * app.js - Arquivo principal da aplicação
 * Responsável por inicialização e controle de eventos do formulário
 */

document.addEventListener("DOMContentLoaded", function () {

  // Preenche o datalist com as cidades disponíveis
  CONFIG.populateDatalist();

  // Ativa o preenchimento automático da distância
  CONFIG.setupDistanceAutoFill();

  // Obtém o formulário da calculadora
  const calculatorForm = document.getElementById("Calculator-form");

  // Adiciona o listener de envio do formulário
  calculatorForm.addEventListener("submit", handleFormSubmit);

  // Log de inicialização
  console.log("🌱 Calculadora inicializada");

  /**
   * =========================
   * HANDLER DE SUBMIT
   * =========================
   * @param {Event} event
   */
  function handleFormSubmit(event) {
    // Impede o envio padrão do formulário
    event.preventDefault();

    /**
     * 1️⃣ CAPTURA DOS DADOS DO FORMULÁRIO
     */

    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();

    const distanceValue = document.getElementById("distance").value;
    const distance = parseFloat(distanceValue);

    const transportInput = document.querySelector(
      'input[name="Transport"]:checked'
    );
    const transportMode = transportInput ? transportInput.value : null;

    /**
     * 2️⃣ VALIDAÇÃO DOS DADOS
     */

    if (!origin || !destination) {
      alert("❌ Preencha a cidade de origem e destino.");
      return;
    }

    if (!distance || distance <= 0) {
      alert("❌ Informe uma distância válida maior que zero.");
      return;
    }

    if (!transportMode) {
      alert("❌ Selecione um meio de transporte.");
      return;
    }

    /**
     * 3️⃣ ESTADO DE LOADING
     */

    const submitButton = calculatorForm.querySelector(
      ".form__submit-button"
    );

    // Mostra loading no botão
    UI.showLoading(submitButton);

    // Esconde resultados anteriores
    UI.hideElement("results");
    UI.hideElement("comparison");
    UI.hideElement("carbon-credits");

    /**
     * 4️⃣ PROCESSAMENTO (SIMULAÇÃO)
     */

    setTimeout(function () {
      try {
        /**
         * =========================
         * CÁLCULOS
         * =========================
         */

        // Emissão do meio selecionado
        const emission = Calculator.calcEmission(distance, transportMode);

        // Emissão do carro (baseline)
        const carEmission = Calculator.calcEmission(distance, "car");

        // Economia em relação ao carro
        const savings =
          transportMode !== "car"
            ? Calculator.calculateSavings(emission, carEmission)
            : null;

        // Comparação entre todos os meios
        const comparison = Calculator.calculateAllModes(distance);

        // Créditos de carbono necessários
        const credits = Calculator.calculateCarborCredits(emission);

        // Estimativa de preço dos créditos
        const creditPrice = Calculator.estimateCreditPrice(credits);

        /**
         * =========================
         * OBJETOS PARA RENDERIZAÇÃO
         * =========================
         */

        const resultsData = {
          origin,
          destination,
          distance,
          emission,
          mode: transportMode,
          savings
        };

        const creditsData = {
          credits,
          price: creditPrice
        };

        /**
         * =========================
         * RENDERIZAÇÃO NA UI
         * =========================
         */

        document.getElementById("results-content").innerHTML =
          UI.renderResults(resultsData);

        document.getElementById("comparison-content").innerHTML =
          UI.renderComparison(comparison, transportMode);

        document.getElementById("carbon-credits-content").innerHTML =
          UI.renderCarbonCredits(creditsData);

        /**
         * =========================
         * EXIBIÇÃO FINAL
         * =========================
         */

        UI.showElement("results");
        UI.showElement("comparison");
        UI.showElement("carbon-credits");

        UI.scrollToElement("results");

        // Remove loading
        UI.hideLoading(submitButton);

        console.log("✅ Cálculo finalizado com sucesso", {
          emission,
          credits,
          savings
        });
      } catch (error) {
        /**
         * =========================
         * TRATAMENTO DE ERROS
         * =========================
         */

        console.error("❌ Erro no cálculo:", error);

        alert(
          "❌ Ocorreu um erro ao realizar o cálculo. Tente novamente."
        );

        UI.hideLoading(submitButton);
      }
    }, 1500); // Simula processamento
  }
});
