// Curated list of top models from Vercel AI Gateway
export const DEFAULT_CHAT_MODEL = "glm-4";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "glm-4",
    name: "智谱 GLM-4",
    provider: "openai",
    description: "智谱最强大的模型，适合复杂任务",
  },
  {
    id: "glm-3-turbo",
    name: "智谱 GLM-3 Turbo",
    provider: "openai",
    description: "快速高效，适合日常任务",
  },
];

// Group models by provider for UI
export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
