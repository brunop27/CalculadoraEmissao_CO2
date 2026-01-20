/**
 * CONFIG
 * Centraliza fatores de emissão, metadados de transporte
 * e funções utilitárias relacionadas à interface e regras
 */
const CONFIG = {

  /**
   * Fatores de emissão de CO₂ (kg por km)
   */
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96
  },

  /**
   * Metadados dos meios de transporte
   * Utilizados para UI (label, ícone e cor)
   */
  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicicleta",
      icon: "🚲",
      color: "#10b981"
    },
    car: {
      label: "Carro",
      icon: "🚗",
      color: "#3b82f6"
    },
    bus: {
      label: "Ônibus",
      icon: "🚌",
      color: "#f59e0b"
    },
    truck: {
      label: "Caminhão",
      icon: "🚚",
      color: "#ef4444"
    }
  },

  /**
   * Configurações relacionadas a créditos de carbono
   */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150
  },

  /**
   * Preenche o datalist de cidades usando os dados do RoutesDB
   */
  populateDatalist: function () {
    // Verifica se o objeto ROUTESDB existe, caso não, a função para.
    if (typeof RoutesDB === "undefined") return;

    // Busca no html o elemento com nome do Id: Cities-list
    const datalist = document.getElementById("Cities-list");
    // Verifica se existe algum elemento com Id: Cities-list, caso não, a função encerra.
    if (!datalist) return;
    // Limpa a lista para evitar duplicidade caso recarregue novamente
    datalist.innerHTML = "";
    // Chama o metodo do objeto que contém todas as cidades e armazena como array
    const cities = RoutesDB.getAllCities();
    // Percorre o array e cria dinamicamente o elemento <option> como filho do elemento <datalist>
    // Cada <option> leva o nome de uma cidade do array percorrido  
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      datalist.appendChild(option);
    });
  },

  /**
   * Configura o preenchimento automático da distância
   * com base na origem e destino selecionados
   */
  setupDistanceAutoFill: function () {
    // Seleciona elementos da DOM
    const originInput = document.getElementById("origin");
    const destinationInput = document.getElementById("destination");
    const distanceInput = document.getElementById("distance");
    const manualCheckbox = document.getElementById("manual-distance");
    // Encontra elemento com a classe .form__helper-text
    const helperText = document.querySelector(".form__helper-text");
    // Verifica se existe elemento no HTML apos a coleta pelo getElementById
    if (!originInput || !destinationInput || !distanceInput || !manualCheckbox) {
      return;
    }

    /**
     * Função interna para tentar localizar a rota
     */
    const tryFindRoute = () => {
        // Captura valores digitados
        // trim() ajuda a remover espaços extras
      const origin = originInput.value.trim();
      const destination = destinationInput.value.trim();
        // Verifica se algum dos campos está vazio, evitando chamadas desnecessárias não fazendo a busca
      if (!origin || !destination) return;
        // Busca rota retornando um numero (km)
      const distance = RoutesDB.findDistance(origin, destination);
        // Verifica se a rota foi encontrada, caso sim procegue o código
      if (distance !== null) {
        // Preenche input com respectivo valor
        distanceInput.value = distance;
        distanceInput.readOnly = true;

        // Mensagem de feedback, melhorar experiência do usuário
        if (helperText) {
          helperText.textContent = "Distância encontrada automaticamente";
          helperText.style.color = "green";
        }
      } else {
        // Limpa o campo, caso rota não seja encontrada
        distanceInput.value = "";
        // Instrui ao usuário a colocar o valor manualmente
        if (helperText) {
          helperText.textContent =
            "Rota não encontrada. Você pode inserir a distância manualmente.";
          helperText.style.color = "#ef4444";
        }
      }
    };

    // Listener para mudanças de origem e destino
    originInput.addEventListener('change', tryFindRoute);
    destinationInput.addEventListener('change', tryFindRoute);

    // Listener do checkbox de distância manual
    manualCheckbox.addEventListener('change', () => {
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;

        if (helperText) {
          helperText.textContent = "Insira a distância manualmente";
          helperText.style.color = "#6b7280";
        }
      } else {
        distanceInput.readOnly = true;
        tryFindRoute();
      }
    });
  }
};
