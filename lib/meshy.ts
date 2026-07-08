import "server-only";

// Meshy Image-to-3D API
// Docs: https://docs.meshy.ai/api/image-to-3d
// Free tier: 200 credits/month, image-to-3d costs 20 credits per generation.

const BASE_URL = "https://api.meshy.ai/openapi/v1/image-to-3d";

type MeshyStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED"
  | "EXPIRED";

export type MeshyTask = {
  id: string;
  status: MeshyStatus;
  progress?: number;
  model_urls?: {
    glb?: string;
    fbx?: string;
    usdz?: string;
    obj?: string;
  };
  task_error?: {
    message?: string;
  } | null;
};

function apiKey(): string {
  const key = process.env.MESHY_API_KEY;
  if (!key) throw new Error("MESHY_API_KEY not configured");
  return key;
}

export async function createMeshyTask(params: {
  frontImageUrl: string;
  backImageUrl?: string;
  name: string;
}): Promise<{ result: string }> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_urls: params.backImageUrl
        ? [params.frontImageUrl, params.backImageUrl]
        : [params.frontImageUrl],
      ai_model: "meshy-4",
      topology: "triangle",
      symmetry_mode: "auto",
      should_remesh: true,
      should_texture: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Meshy create failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function getMeshyTask(taskId: string): Promise<MeshyTask> {
  const res = await fetch(`${BASE_URL}/${taskId}`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Meshy get failed: ${res.status} ${text}`);
  }
  return res.json();
}
