interface SslAnalysisResult {
  endpoints: {
    grade: string;
  }[];
}

export async function handler(event: SslAnalysisResult) {
  return event.endpoints.map(e => e.grade).sort().pop();
}
