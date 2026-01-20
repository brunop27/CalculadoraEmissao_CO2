/**
 * Calculator
 * Objeto global responsável por todos os cálculos do projeto:

 */
const Calculator = {

  /**
   * Calcula a emissão de CO₂ para uma distância e meio de transporte
   * @param {number} distanceKm - Distância em quilômetros
   * @param {string} transportMode - Modo de transporte (bicycle, car, bus, truck)
   * @returns {number} Emissão em kg de CO₂ (2 casas decimais)
   */
  
  calcEmission: function (distanceKm, transportMode) {
    // Obtém o fator de emissão com base no meio de transporte
    const factor = CONFIG.EMISSION_FACTORS[transportMode];

    // Cálculo da emissão: distância * fator de emissão
    const emission = distanceKm * factor;

    // Retorna o valor arredondado para 2 casas decimais
    return Math.round(emission * 100) / 100;
  },

  /**
   * Calcula a emissão para todos os meios de transporte
   * e compara cada um com o carro (baseline)
   * @param {number} distanceKm - Distância em quilômetros
   * @returns {Array} Lista ordenada do menor para o maior impacto ambiental
   */
  calculateAllModes: function (distanceKm) {
    const results = [];

    // Emissão do carro usada como base de comparação
    const carEmission = this.calcEmission(distanceKm, "car");

    // Percorre todos os meios de transporte configurados
    for (const mode in CONFIG.EMISSION_FACTORS) {
      const emission = this.calcEmission(distanceKm, mode);

      // Percentual em relação ao carro
      const percentageVsCar = carEmission > 0
        ? (emission / carEmission) * 100
        : 0;

      results.push({
        mode: mode,
        emission: Math.round(emission * 100) / 100,
        percentageVsCar: Math.round(percentageVsCar * 100) / 100
      });
    }

    // Ordena do menor para o maior valor de emissão
    results.sort((a, b) => a.emission - b.emission);

    return results;
  },

  /**
   * Calcula a economia de CO₂ em relação a um valor base
   * @param {number} emission - Emissão atual
   * @param {number} baselineEmission - Emissão de referência (ex: carro)
   * @returns {Object} Economia em kg e percentual
   */
  calculateSavings: function (emission, baselineEmission) {
    // Quantidade de CO₂ economizada
    const savedKg = baselineEmission - emission;

    // Percentual de economia
    const percentage = baselineEmission > 0
      ? (savedKg / baselineEmission) * 100
      : 0;

    return {
      savedKg: Math.round(savedKg * 100) / 100,
      percentage: Math.round(percentage * 100) / 100
    };
  },

  /**
   * Calcula a quantidade de créditos de carbono necessários
   * @param {number} emissionKg - Emissão em kg de CO₂
   * @returns {number} Créditos de carbono (4 casas decimais)
   */
  calculateCarborCredits: function (emissionKg) {
    // Cada crédito compensa uma quantidade fixa de CO₂
    const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;

    return Math.round(credits * 10000) / 10000;
  },

  /**
   * Estima o preço dos créditos de carbono
   * @param {number} credits - Quantidade de créditos
   * @returns {Object} Preço mínimo, máximo e médio em BRL
   */
  estimateCreditPrice: function (credits) {
    // Preço mínimo estimado
    const min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;

    // Preço máximo estimado
    const max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;

    // Preço médio
    const average = (min + max) / 2;

    return {
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      average: Math.round(average * 100) / 100
    };
  }
};
