import type { ITokenService, TokenInfo } from "../types/token-service.d";

/// TODO
// - [ ] process the result with valibot
export class TokenService implements ITokenService {
  readonly endpoint: string = "https://allbridgeapi.net/token-info";

  public async getTokensInfo() {
    const resp = await fetch(this.endpoint);

    if (!resp || !String(resp.status).startsWith("2")) {
      throw new Error("Can not fetch token info");
    }

    const data: TokenInfo = await resp.json();

    return data;
  }
}
