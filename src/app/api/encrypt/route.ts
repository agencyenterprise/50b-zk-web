import { encryptWitness } from "@/utils/cryptography";

export async function POST(req: Request) {
    const data = await req.json();

    const { base64EncryptedWitness, base64EncryptedAesKey, base64AesIv } = encryptWitness(data.base64EnclavePublicKey, data.base64Witness);
    
    return Response.json({ base64EncryptedWitness, base64EncryptedAesKey, base64AesIv });
}
