import crypto from "crypto"

const server_secret = process.env.SECRET as string;

if (!server_secret?.length) {
    throw new Error("missing server_secret environmnent!");
}


export function generatePair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
    });

    return {
        public: publicKey.export({ type: "spki", format: "der" }).toString("base64"),
        private: privateKey.export({ type: "pkcs8", format: "der" }).toString("base64")
    }
}


export function rsaEncrypt(data: object | string, publicBase64: string) {
    const publicKey = crypto.createPublicKey({
        key: Buffer.from(publicBase64, "base64"),
        format: "der",
        type: "spki",
    });

    return crypto.publicEncrypt(publicKey, Buffer.from(JSON.stringify(data), "utf8")).toString("base64")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rsaDecrypt(encrypted: string, privateBase64: string) {
    const privateKey = crypto.createPrivateKey({
        key: Buffer.from(privateBase64, "base64"),
        format: "der",
        type: "pkcs8",
    });

    return JSON.parse(
        crypto.privateDecrypt(privateKey, Buffer.from(encrypted, "base64")).toString("utf8")
    )
}
