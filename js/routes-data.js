/**
 * routes-data.js
 * ------------------------------------------------------
 * Base de dados de rotas brasileiras para a Calculadora
 * de Emissão de CO₂.
 *
 * Este arquivo define um único objeto global chamado
 * RoutesDB, responsável por:
 *  - Armazenar rotas entre cidades
 *  - Fornecer lista de cidades para autocomplete
 *  - Retornar a distância entre duas cidades
 * 
 * ------------------------------------------------------
 */

const RoutesDB = {
  /**
   * Lista de rotas disponíveis
   * Cada rota possui:
   *  - origin: cidade de origem (string)
   *  - destination: cidade de destino (string)
   *  - distanceKm: distância real aproximada em km (number)
   */
  routes: [
    // Sudeste
    { origin: "São Paulo - SP", destination: "Rio de Janeiro - RJ", distanceKm: 430 },
    { origin: "São Paulo - SP", destination: "Campinas - SP", distanceKm: 65 },
    { origin: "São Paulo - SP", destination: "Santos - SP", distanceKm: 77 },
    { origin: "São Paulo - SP", destination: "Belo Horizonte - MG", distanceKm: 586 },
    { origin: "Rio de Janeiro - RJ", destination: "Niterói - RJ", distanceKm: 13 },
    { origin: "Belo Horizonte - MG", destination: "Ouro Preto - MG", distanceKm: 100 },
    { origin: "Belo Horizonte - MG", destination: "Vitória - ES", distanceKm: 524 },

    // Centro-Oeste
    { origin: "São Paulo - SP", destination: "Brasília - DF", distanceKm: 1015 },
    { origin: "Rio de Janeiro - RJ", destination: "Brasília - DF", distanceKm: 1148 },
    { origin: "Brasília - DF", destination: "Goiânia - GO", distanceKm: 209 },
    { origin: "Brasília - DF", destination: "Cuiabá - MT", distanceKm: 1135 },
    { origin: "Campo Grande - MS", destination: "Cuiabá - MT", distanceKm: 694 },

    // Sul
    { origin: "Curitiba - PR", destination: "São Paulo - SP", distanceKm: 408 },
    { origin: "Curitiba - PR", destination: "Florianópolis - SC", distanceKm: 300 },
    { origin: "Florianópolis - SC", destination: "Porto Alegre - RS", distanceKm: 476 },
    { origin: "Porto Alegre - RS", destination: "Caxias do Sul - RS", distanceKm: 127 },
    { origin: "Joinville - SC", destination: "Curitiba - PR", distanceKm: 130 },

    // Nordeste
    { origin: "Salvador - BA", destination: "Feira de Santana - BA", distanceKm: 108 },
    { origin: "Salvador - BA", destination: "Recife - PE", distanceKm: 839 },
    { origin: "Recife - PE", destination: "João Pessoa - PB", distanceKm: 120 },
    { origin: "Recife - PE", destination: "Natal - RN", distanceKm: 297 },
    { origin: "Fortaleza - CE", destination: "Horizonte - CE", distanceKm: 42 },
    { origin: "Fortaleza - CE", destination: "Pacajus - CE", distanceKm: 55 },
    { origin: "Fortaleza - CE", destination: "Natal - RN", distanceKm: 537 },
    { origin: "Maceió - AL", destination: "Aracaju - SE", distanceKm: 277 },
    { origin: "São Luís - MA", destination: "Teresina - PI", distanceKm: 446 },

    // Norte
    { origin: "Manaus - AM", destination: "Boa Vista - RR", distanceKm: 785 },
    { origin: "Belém - PA", destination: "Macapá - AP", distanceKm: 329 },
    { origin: "Belém - PA", destination: "São Luís - MA", distanceKm: 806 },
    { origin: "Porto Velho - RO", destination: "Rio Branco - AC", distanceKm: 544 },
    { origin: "Palmas - TO", destination: "Brasília - DF", distanceKm: 973 }
  ],

  /**
   * Retorna todas as cidades únicas presentes nas rotas
   * - Extrai origem e destino
   * - Remove duplicatas
   * - Ordena alfabeticamente
   */
  getAllCities: function () {
    const cities = [];

    this.routes.forEach(route => {
      cities.push(route.origin);
      cities.push(route.destination);
    });

    return [...new Set(cities)].sort((a, b) => a.localeCompare(b));
  },

  /**
   * Busca a distância entre duas cidades
   * - Aceita origem e destino em qualquer ordem
   * - Normaliza texto (trim + lowercase)
   * - Retorna distância em km ou null se não encontrar
   */
  findDistance: function (origin, destination) {
    if (!origin || !destination) return null;

    const normalize = value => value.trim().toLowerCase();

    const originNormalized = normalize(origin);
    const destinationNormalized = normalize(destination);

    const route = this.routes.find(r =>
      (normalize(r.origin) === originNormalized &&
        normalize(r.destination) === destinationNormalized) ||
      (normalize(r.origin) === destinationNormalized &&
        normalize(r.destination) === originNormalized)
    );

    return route ? route.distanceKm : null;
  }
};
