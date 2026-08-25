// Server-only helper untuk cleanup file Uploadcare
import { env } from "$env/dynamic/private";

const PUB_KEY = "32ily8ib82";

// ponytail: tangkap uuid dari semua varian URL Uploadcare
// (ucarecd.net/<uuid>, <pub>.ucarecd.net/<uuid>, ucrcare.com/<uuid>)
export function extractUuid(url: string): string | null {
    const match = url.match(/https:\/\/(?:[a-z0-9]+\.)?u(?:carecd|crcare)\.(?:net|com)\/([a-f0-9-]{36})/i);
    return match ? match[1] : null;
}

export async function deleteUploadcareFile(uuid: string): Promise<boolean> {
    const secret = env.UPLOADCARE_SECRET_KEY;
    if (!secret) {
        console.warn("UPLOADCARE_SECRET_KEY belum diisi — file tidak dihapus dari Uploadcare");
        return false;
    }

    try {
        const res = await fetch(`https://api.uploadcare.com/files/${uuid}/storage/`, {
            method: "DELETE",
            headers: {
                Authorization: `Uploadcare.Simple ${PUB_KEY}:${secret}`,
                Accept: "application/vnd.uploadcare-v3+json"
            }
        });
        return res.ok || res.status === 204;
    } catch (err) {
        console.error("Gagal hapus file Uploadcare:", err);
        return false;
    }
}
