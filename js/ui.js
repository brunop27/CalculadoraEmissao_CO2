/**
 * UI - Objeto global responsável pela renderização da interface
 * Contém métodos utilitários e funções de renderização dos resultados
 */

const UI = {

  /**
   * Formata um número com casas decimais e separador de milhares
   * @param {number} number - Número a ser formatado
   * @param {number} decimals - Quantidade de casas decimais
   * @returns {string} Número formatado (ex: 1.234,56)
   */
  formatNumber: function (number, decimals = 2) {
    return Number(number).toLocaleString("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  /**
   * Formata um valor em Real (BRL)
   * @param {number} value - Valor monetário
   * @returns {string} Valor formatado (ex: R$ 1.234,56)
   */
  formatCurrency: function (value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  },

  /**
   * Exibe um elemento removendo a classe 'hidden'
   * @param {string} elementId - ID do elemento
   */
  showElement: function (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove("hidden");
    }
  },

  /**
   * Oculta um elemento adicionando a classe 'hidden'
   * @param {string} elementId - ID do elemento
   */
  hideElement: function (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add("hidden");
    }
  },

  /**
   * Rola a tela suavemente até um elemento
   * @param {string} elementId - ID do elemento
   */
  scrollToElement: function (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  /**
   * Renderiza os resultados principais do cálculo
   * @param {Object} data - Dados do resultado
   * @returns {string} HTML da seção de resultados
   */
  renderResults: function (data) {
    const modeData = CONFIG.TRANSPORT_MODES[data.mode];

    let html = `
      <h2 class="section-title">Resultados da Emissão</h2>
      <div class="results__grid">

        <div class="results__card">
          <div class="results__card-icon">🗺️</div>
          <div class="results__card-content">
            <h3 class="results__card-title">Rota</h3>
            <p class="results__card-value">${data.origin} → ${data.destination}</p>
          </div>
        </div>

        <div class="results__card">
          <div class="results__card-icon">📏</div>
          <div class="results__card-content">
            <h3 class="results__card-title">Distância</h3>
            <p class="results__card-value">${this.formatNumber(data.distance, 0)} km</p>
          </div>
        </div>

        <div class="results__card results__card--highlight">
          <div class="results__card-icon">🌿</div>
          <div class="results__card-content">
            <h3 class="results__card-title">Emissão de CO₂</h3>
            <p class="results__card-value results__card-value--large">
              ${this.formatNumber(data.emission)} kg
            </p>
          </div>
        </div>

        <div class="results__card">
          <div class="results__card-icon">${modeData.icon}</div>
          <div class="results__card-content">
            <h3 class="results__card-title">Meio de Transporte</h3>
            <p class="results__card-value">${modeData.label}</p>
          </div>
        </div>
    `;

    // Card de economia (quando não for carro)
    if (data.mode !== "car" && data.savings && data.savings.savedKg > 0) {
      html += `
        <div class="results__card results__card--success">
          <div class="results__card-icon">✅</div>
          <div class="results__card-content">
            <h3 class="results__card-title">Economia vs Carro</h3>
            <p class="results__card-value">
              ${this.formatNumber(data.savings.savedKg)} kg
            </p>
            <p class="results__card-subtitle">
              ${this.formatNumber(data.savings.percentage)}% menos emissões
            </p>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  },

  /**
   * Renderiza a comparação entre os meios de transporte
   * @param {Array} modesArray - Array do Calculator.calculateAllModes()
   * @param {string} selectedMode - Meio selecionado
   * @returns {string} HTML da comparação
   */
  renderComparison: function (modesArray, selectedMode) {
    let html = `
      <h2 class="section-title">Comparação entre Meios de Transporte</h2>
      <div class="comparison__grid">
    `;

    const maxEmission = Math.max(...modesArray.map(m => m.emission));

    modesArray.forEach(modeObj => {
      const modeData = CONFIG.TRANSPORT_MODES[modeObj.mode];
      const isSelected = modeObj.mode === selectedMode;
      const barWidth = maxEmission > 0 ? (modeObj.emission / maxEmission) * 100 : 0;

      let barColor;
      if (modeObj.percentageVsCar <= 25) barColor = "#10b981";
      else if (modeObj.percentageVsCar <= 75) barColor = "#f59e0b";
      else if (modeObj.percentageVsCar <= 100) barColor = "#fb923c";
      else barColor = "#ef4444";

      html += `
        <div class="comparison__item${isSelected ? " comparison__item--selected" : ""}">
          <div class="comparison__header">
            <span class="comparison__icon">${modeData.icon}</span>
            <span class="comparison__label">${modeData.label}</span>
            ${isSelected ? '<span class="comparison__badge">Selecionado</span>' : ""}
          </div>

          <div class="comparison__stats">
            <span>${this.formatNumber(modeObj.emission)} kg CO₂</span>
            <span>${this.formatNumber(modeObj.percentageVsCar)}%</span>
          </div>

          <div class="comparison__bar-container">
            <div class="comparison__bar" style="width:${barWidth}%; background:${barColor}"></div>
          </div>
        </div>
      `;
    });

    html += `
      </div>
      <div class="comparison__tip">
        💡 <strong>Dica:</strong> meios mais sustentáveis reduzem significativamente as emissões de CO₂.
      </div>
    `;

    return html;
  },

  /**
   * Renderiza informações sobre créditos de carbono
   * @param {Object} creditsData - Dados de créditos e preços
   * @returns {string} HTML da seção de créditos
   */
  renderCarbonCredits: function (creditsData) {
    return `
      <h2 class="section-title">Créditos de Carbono</h2>

      <div class="carbon-credits__grid">
        <div class="carbon-credits__card">
          <h3>Créditos Necessários</h3>
          <p class="carbon-credits__value">
            ${this.formatNumber(creditsData.credits, 4)}
          </p>
          <p class="carbon-credits__helper">1 crédito = 1.000 kg de CO₂</p>
        </div>

        <div class="carbon-credits__card">
          <h3>Custo Estimado</h3>
          <p class="carbon-credits__value">
            ${this.formatCurrency(creditsData.price.average)}
          </p>
          <p class="carbon-credits__helper">
            ${this.formatCurrency(creditsData.price.min)} – ${this.formatCurrency(creditsData.price.max)}
          </p>
        </div>
      </div>

      <div class="carbon-credits__info">
        Créditos de carbono compensam emissões financiando projetos ambientais.
      </div>

      <div class="carbon-credits__action">
        <button type="button" class="carbon-credits__button">🌱 Compensar Emissões</button>
      </div>
    `;
  },

  /**
   * Exibe estado de carregamento no botão
   * @param {HTMLElement} buttonElement
   */
  showLoading: function (buttonElement) {
    buttonElement.dataset.originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  /**
   * Remove o estado de carregamento do botão
   * @param {HTMLElement} buttonElement
   */
  hideLoading: function (buttonElement) {
    buttonElement.disabled = false;
    if (buttonElement.dataset.originalText) {
      buttonElement.innerHTML = buttonElement.dataset.originalText;
    }
  }
};
