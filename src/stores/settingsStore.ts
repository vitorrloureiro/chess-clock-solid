import type { SettingsManager } from "../libs/settings-manager/SettingsManager";
import type { Settings } from "../libs/settings-manager/types/Settings";

import { createResource, onMount, onCleanup } from "solid-js";
import { createStore, reconcile, unwrap } from "solid-js/store";

import { useTheme } from "../hooks/useTheme";

export function createSettingsStore(settingsManager: SettingsManager) {
  const [settings, setSettings] = createStore({ ...settingsManager.defaultSettings });

  useTheme(() => settings.global.theme);

  async function saveSettings() {
    await settingsManager.saveSettings(unwrap(settings));
  }

  onMount(() => {
    function settingsSavedEventListener(newSettings: Settings) {
      setSettings(reconcile(newSettings));
    }

    settingsManager.addEventListener("settingssaved", settingsSavedEventListener);

    onCleanup(() => {
      settingsManager.removeEventListener("settingssaved", settingsSavedEventListener);
    });
  });

  createResource(async () => {
    await settingsManager.init();
    const loadedSettings = await settingsManager.loadSettings();

    if (loadedSettings) {
      setSettings(loadedSettings);
    }
  });

  return { settings, setSettings, saveSettings };
}
