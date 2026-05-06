
/**
 * Implementação simples de Rate Limiting em memória para Next.js.
 * Nota: Em ambientes serveless (como Vercel), este cache é reiniciado quando a função 
 * entra em modo "cold start", mas serve como uma primeira camada de defesa eficaz.
 */

interface RateLimitConfig {
  interval: number; // Intervalo em milissegundos
  uniqueTokenPerInterval: number; // Quantidade de tokens únicos por intervalo
}

export const rateLimit = (options: RateLimitConfig) => {
  const tokenCache = new Map();
  
  return {
    check: (limit: number, token: string) => {
      const now = Date.now();
      const tokenCount = tokenCache.get(token) || [0];
      
      // Limpa cache se o intervalo passou
      if (tokenCount[1] && now - tokenCount[1] > options.interval) {
        tokenCache.set(token, [1, now]);
        return Promise.resolve();
      }

      if (tokenCount[0] >= limit) {
        return Promise.reject();
      }

      tokenCount[0] += 1;
      tokenCount[1] = tokenCount[1] || now;
      tokenCache.set(token, tokenCount);
      
      // Limpeza periódica do Map para evitar vazamento de memória
      if (tokenCache.size > options.uniqueTokenPerInterval) {
        tokenCache.clear();
      }

      return Promise.resolve();
    },
  };
};

// Configuração: 5 requisições a cada 60 segundos
export const limiter = rateLimit({
  interval: 60000, 
  uniqueTokenPerInterval: 500,
});
