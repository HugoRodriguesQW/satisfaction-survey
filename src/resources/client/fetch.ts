type ResponseType = "json" | "text" | "none";

export async function apiPost<T>(path: string, body: unknown, responseType: ResponseType): Promise<T> {
  const res = await fetch(location.origin + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw res;
  return await parseResponse(res, responseType);
}

export async function apiGet<T>(path: string, responseType: ResponseType): Promise<T> {
  const res = await fetch(location.origin + path, {
    method: "GET",
  });
  if (!res.ok) throw res;
  return await parseResponse(res, responseType);
}

function parseResponse(response: Response, type: ResponseType) {
  switch (type) {
    case "json":
      return response.json();
    case "text":
      return response.text();
  }
}
