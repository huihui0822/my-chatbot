import { createOpenAI } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

const THINKING_SUFFIX_REGEX = /-thinking$/;

// 配置智谱 API（使用 OpenAI 兼容格式）
const zhipuClient = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE || "https://open.bigmodel.cn/api/paas/v4",
  apiKey: process.env.OPENAI_API_KEY,
  name: "zhipu",
});

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : null;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel(modelId);
  }

  const isReasoningModel =
    modelId.endsWith("-thinking") ||
    (modelId.includes("reasoning") && !modelId.includes("non-reasoning"));

  if (isReasoningModel) {
    const cleanModelId = modelId.replace(THINKING_SUFFIX_REGEX, "");
    return wrapLanguageModel({
      model: zhipuClient.chat(cleanModelId),
      middleware: extractReasoningMiddleware({ tagName: "thinking" }),
    });
  }

  return zhipuClient.chat(modelId);
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }
  return zhipuClient.chat("glm-3-turbo");
}

export function getArtifactModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("artifact-model");
  }
  return zhipuClient.chat("glm-3-turbo");
}
