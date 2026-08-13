// ==========================================================
// 送信データの永続化(AsyncStorage版)
// 元: Moodish/js/app.js, js/admin.js の localStorage 利用箇所を移植
// ==========================================================
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ProposalSubmission } from "../types";

const STORAGE_KEY = "dateSpotProposalSubmissions";

export async function getSubmissions(): Promise<ProposalSubmission[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProposalSubmission[]) : [];
  } catch {
    return [];
  }
}

export async function saveSubmission(submission: ProposalSubmission): Promise<void> {
  const list = await getSubmissions();
  list.unshift(submission);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function clearSubmissions(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
