import type { Settings } from "./settings-manager/types/Settings";

import { ChessClockService } from "./chess-clock-service/ChessClockService";
import { SettingsManager } from "./settings-manager/SettingsManager";
import { AudioPlayer } from "./audio-player/AudioPlayer";

const settingsManager = new SettingsManager();

const chessClockService = new ChessClockService(
  {
    countdownFrom: settingsManager.lastLoadedSettings.player1.startTime,
    incrementBy: settingsManager.lastLoadedSettings.player1.incrementBy,
  },
  {
    countdownFrom: settingsManager.lastLoadedSettings.player2.startTime,
    incrementBy: settingsManager.lastLoadedSettings.player2.incrementBy,
  }
);

settingsManager.addEventListener("settingsloaded", updateSettings);

settingsManager.addEventListener("settingssaved", updateSettings);

function updateSettings(newSettings: Readonly<Settings>) {
  chessClockService.player1Config.countdownFrom = newSettings.player1.startTime;
  chessClockService.player1Config.incrementBy = newSettings.player1.incrementBy;
  chessClockService.player2Config.countdownFrom = newSettings.player2.startTime;
  chessClockService.player2Config.incrementBy = newSettings.player2.incrementBy;
  chessClockService.dispatchEvent(
    "playerconfigchange",
    chessClockService.player1Config,
    chessClockService.player2Config
  );
}

const audioPlayer = new AudioPlayer();

export { settingsManager, chessClockService, audioPlayer };
