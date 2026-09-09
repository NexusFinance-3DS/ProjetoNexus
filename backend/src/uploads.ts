import multer from "multer";
import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "../uploads/transacoes"));
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 15, fieldSize: 10000, parts: 16 },
});

export function attachmentName(name: string): string {
  // Multipart filenames sent by fetch use UTF-8; Busboy defaults to Latin-1.
  if ([...name].every((char) => char.charCodeAt(0) <= 255)) {
    const decoded = Buffer.from(name, "latin1").toString("utf8");
    if (!decoded.includes("\uFFFD")) name = decoded;
  }
  return (name.replace(/\\/g, "/").split("/").pop() || "arquivo").replace(/[\x00-\x1f\x7f]/g, "").slice(0, 255) || "arquivo";
}

export async function storeAttachment(file: Express.Multer.File): Promise<string> {
  await mkdir(uploadDirectory, { recursive: true });
  const key = randomUUID();
  await writeFile(path.join(uploadDirectory, key), file.buffer, { flag: "wx" });
  return key;
}

export async function removeAttachment(key: string): Promise<void> {
  await unlink(path.join(uploadDirectory, key)).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "ENOENT") throw error;
  });
}
