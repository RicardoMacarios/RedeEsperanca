export const causaConfig = {
  animais:       { cor: '#1D9E75', corClara: '#E1F5EE', icone: '🐾', label: 'Animais' },
  meio_ambiente: { cor: '#639922', corClara: '#EAF3DE', icone: '🌿', label: 'Meio Ambiente' },
  saude_idosos:  { cor: '#378ADD', corClara: '#E6F1FB', icone: '❤️', label: 'Saúde & Idosos' },
  educacao:      { cor: '#BA7517', corClara: '#FAEEDA', icone: '📚', label: 'Educação' },
};

export function enriquecerCampanha(c) {
  const config = causaConfig[c.causa] ?? {};
  return {
    ...c,
    cor:      c.cor      ?? config.cor,
    corClara: c.corClara ?? config.corClara,
    icone:    c.icone    ?? config.icone,
    doacoes:  c.doacoes  ?? [],
  };
}
