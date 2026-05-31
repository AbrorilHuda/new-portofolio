import { writable } from 'svelte/store';

export const aiAssistantOpen = writable(false);

export function toggleAiAssistant() {
    aiAssistantOpen.update((open: boolean) => !open);
}

export function openAiAssistant() {
    aiAssistantOpen.set(true);
}

export function closeAiAssistant() {
    aiAssistantOpen.set(false);
}
