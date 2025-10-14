export type UTMParams = Partial<{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}>;

export function appendUtm(url: string, params: UTMParams): string {
  try {
    const u = new URL(url);
    Object.entries(params).forEach(([k, v]) => {
      if (!v) return;
      u.searchParams.set(k, v);
    });
    return u.toString();
  } catch {
    return url;
  }
}


