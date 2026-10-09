// Server-only helper untuk cleanup file Uploadcare
import { env } from "$env/dynamic/private";
import { PUBLIC_UPLOADCARE_PUBLIC_KEY } from "$env/static/public";

const PUB_KEY = PUBLIC_UPLOADCARE_PUBLIC_KEY || "testing";

// tangkap uuid dari semua varian URL Uploadcare
// (ucarecdn.com/<uuid>, <pub>.ucarecdn.net/<uuid>, ucrcare.com/<uuid>)
export function extractUuid(url: string): string | null {
    if (!url) return null;
    const match = url.match(/https?:\/\/(?:[a-z0-9]+\.)?(?:ucarecdn|ucarecd|ucrcare)\.(?:net|com)\/([a-f0-9-]{36})/i);
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
