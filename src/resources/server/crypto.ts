import crypto from "crypto";

const algorithm = "aes-256-ecb";
const server_secret = process.env.SECRET as string;

if (!server_secret?.length) {
  throw new Error("missing server_secret environmnent!");
}

export class Hash {
  private partials: string[];

  constructor(...partials: string[]) {
    this.partials = partials;
  }

  update(...partials: string[]) {
    return new Hash(...this.partials, ...partials);
  }

  toString() {
    return this.valueOf();
  }

  toJSON() {
    return this.valueOf();
  }

  valueOf() {
    return this.digest("hex");
  }

  withSecret() {
    return this.update(server_secret);
  }

  digest(encoding: crypto.BinaryToTextEncoding) {
    const token = crypto.createHmac("sha256", this.partials[0]);
    for (const partial of this.partials.slice(1)) {
      token.update(partial);
    }
    return token.digest(encoding);
  }
}

export function encrypt(data: object | string, hash: Hash) {
  const key = Buffer.from(hash, "hex");
  const cipher = crypto.createCipheriv(algorithm, key, null);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(encrypted: string, hash: Hash) {
  try {
    const key = Buffer.from(hash, "hex");

    const cipher = crypto.createDecipheriv(algorithm, key, null);
    let decrypted = cipher.update(encrypted, "hex", "utf8");
    decrypted += cipher.final("utf8");
    return JSON.parse(decrypted);
  } catch {
    return false;
  }
}

export function randomBytes(size: number) {
  return crypto.randomBytes(size).toString("hex");
}
