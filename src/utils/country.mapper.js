const languageNames = new Intl.DisplayNames(['es'], { type: 'language' })

export function mapCountry(raw) {
  const currency = raw.currencies?.[0]

  return {
    code: raw.codes.alpha_2,
    name: raw.names.translations?.spa?.common ?? raw.names.common,
    capital: raw.capitals?.[0]?.name ?? 'Sin capital',
    population: raw.population,
    region: raw.region,
    continent: raw.continents?.[0] ?? raw.region,
    area: raw.area?.kilometers,
    languages: (raw.languages ?? []).map((l) => languageNames.of(l.iso639_1 ?? l.iso639_3)),
    timezones: raw.timezones ?? [],
    callingCode: raw.calling_codes?.[0] ? `+${raw.calling_codes[0]}` : '—',
    tld: raw.tlds?.[0] ?? '—',
    drivingSide: raw.cars?.driving_side,
    borders: raw.borders ?? [],
    currency: currency
      ? { code: currency.code, name: currency.name, symbol: currency.symbol?.trim() }
      : null,
  }
}
