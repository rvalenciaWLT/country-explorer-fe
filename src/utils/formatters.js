export const flagUrl = (code, size = 160) =>
  `https://flagcdn.com/w${size}/${code.toLowerCase()}.png`

export const formatPopulation = (n) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)} M` : n.toLocaleString('es-PE')

export const formatArea = (km) => (km ? `${km.toLocaleString('es-PE')} km²` : '—')

export const formatDrivingSide = (side) => ({ right: 'Derecha', left: 'Izquierda' })[side] ?? '—'
