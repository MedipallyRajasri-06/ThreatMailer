import { DomainIntelligenceItem } from '../types/forensic';

// High-profile target domains commonly impersonated in phishing attacks
const MONITORED_BRANDS = [
  'paypal.com',
  'microsoft.com',
  'google.com',
  'apple.com',
  'amazon.com',
  'netflix.com',
  'chase.com',
  'bankofamerica.com',
  'wellsfargo.com',
  'sbi.co.in',
  'hdfcbank.com',
  'icicibank.com',
  'gov.in',
];

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = new Array<number[]>(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    let row = (matrix[i] = new Array<number>(an + 1));
    row[0] = i;
  }
  const firstRow = matrix[0];
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j;
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion / deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Analyzes a domain for homoglyph substitution, brand imitation, and registration metadata
 */
export async function analyzeDomain(domain: string): Promise<DomainIntelligenceItem> {
  const cleanDomain = domain.toLowerCase().trim().replace(/^www\./, '');
  const baseName = cleanDomain.split('.')[0];
  const tld = cleanDomain.includes('.') ? `.${cleanDomain.split('.').slice(1).join('.')}` : '';

  let isLookalike = false;
  let lookalikeTarget: string | undefined = undefined;
  let similarityReason: string | undefined = undefined;

  // Check character substitution tricks (e.g. 1 -> l, 0 -> o, vv -> w)
  const normalized = baseName
    .replace(/1/g, 'l')
    .replace(/0/g, 'o')
    .replace(/vv/g, 'w')
    .replace(/rn/g, 'm')
    .replace(/[\-_]/g, '');

  for (const brand of MONITORED_BRANDS) {
    const brandBase = brand.split('.')[0];

    if (baseName.includes(brandBase) && cleanDomain !== brand) {
      isLookalike = true;
      lookalikeTarget = brand;
      similarityReason = `Domain contains targeted brand string "${brandBase}" with unauthorized prefix/suffix.`;
      break;
    }

    if (normalized.includes(brandBase) && cleanDomain !== brand) {
      isLookalike = true;
      lookalikeTarget = brand;
      similarityReason = `Domain uses character substitution (homoglyph attack: "1" for "l" or "0" for "o") to imitate ${brand}.`;
      break;
    }

    const dist = levenshtein(baseName, brandBase);
    if (dist > 0 && dist <= 2 && Math.abs(baseName.length - brandBase.length) <= 2) {
      isLookalike = true;
      lookalikeTarget = brand;
      similarityReason = `High Levenshtein proximity (edit distance: ${dist}) to legitimate brand ${brand}.`;
      break;
    }
  }

  // Suspicious TLDs
  const highRiskTlds = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.work', '.click', '.loan', '.example'];
  const isHighRiskTld = highRiskTlds.some((bad) => cleanDomain.endsWith(bad));

  // Determine risk score
  let riskScore = 15;
  if (isLookalike) riskScore += 55;
  if (isHighRiskTld) riskScore += 25;
  riskScore = Math.min(100, riskScore);

  const reputation: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' =
    riskScore >= 75 ? 'MALICIOUS' : riskScore >= 40 ? 'SUSPICIOUS' : 'SAFE';

  // Demo WHOIS registration timestamps (suspicious domains are simulated as newly registered)
  const ageDays = isLookalike || isHighRiskTld ? 3 : 3650;
  const now = new Date();
  const creationDate = new Date(now.getTime() - ageDays * 24 * 3600 * 1000).toISOString();
  const expiryDate = new Date(now.getTime() + (365 - ageDays) * 24 * 3600 * 1000).toISOString();

  return {
    domain: cleanDomain,
    registrar: isLookalike ? 'Offshore Privacy Proxy Shield Ltd' : 'MarkMonitor / Cloudflare DNS',
    creationDate,
    expiryDate,
    ageDays,
    nameservers: isLookalike
      ? ['ns1.bulletproof-dns.xyz', 'ns2.bulletproof-dns.xyz']
      : ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
    tld,
    riskScore,
    reputation,
    lookalikeTarget,
    similarityReason,
  };
}
