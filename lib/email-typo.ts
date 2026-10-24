// Suggests a fix for common email domain typos, e.g. "name@gmial.com" -> "name@gmail.com".
const COMMON_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com", "icloud.com", "aol.com", "msn.com",
  "protonmail.com", "proton.me", "yahoo.co.uk", "hotmail.co.uk", "yahoo.fr", "hotmail.fr", "orange.fr",
  "gmx.de", "gmx.net", "web.de", "t-online.de", "libero.it", "yandex.ru", "mail.ru", "qq.com", "163.com", "126.com",
];
const COMMON_TLDS = ["com", "net", "org", "co.uk", "de", "fr", "ru", "pk", "ae", "sa", "cn"];

function distance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain || COMMON_DOMAINS.includes(domain)) return null;

  // Closest well-known provider (only for small typos, so real company domains are left alone).
  let best: string | null = null;
  let bestScore = Infinity;
  for (const d of COMMON_DOMAINS) {
    const score = distance(domain, d);
    if (score < bestScore) { best = d; bestScore = score; }
  }
  if (best && bestScore > 0 && bestScore <= (domain.length > 8 ? 2 : 1)) return `${local}@${best}`;

  // Otherwise check only the ending: "company.con" -> "company.com".
  const dot = domain.lastIndexOf(".");
  if (dot > 0) {
    const tld = domain.slice(dot + 1);
    if (!COMMON_TLDS.includes(tld)) {
      const fix = COMMON_TLDS.find((t) => !t.includes(".") && distance(tld, t) === 1 && tld.length >= 3);
      if (fix) return `${local}@${domain.slice(0, dot)}.${fix}`;
    }
  }
  return null;
}
