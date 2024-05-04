import type { PlayerSettings as PlayerSettingsType } from "../../../libs/settings-manager/types/Settings";
import type { Theme } from "../../../libs/settings-manager/enums/Theme";

import styles from "./SettingsForm.module.scss";

import { GlobalSettings } from "../GlobalSettings/GlobalSettings";
import { PlayerSettings } from "../PlayerSettings/PlayerSettings";
import { useSettingsStoreContext } from "../../../contexts/SettingsStoreContext";
import { useChessClockStoreContext } from "../../../contexts/ChessClockStoreContext";

type SettingsFormProps = {
  onCancel: () => void;
};

type Player = {
  key: "player1" | "player2";
  legend: string;
  playerSettings: PlayerSettingsType;
};

export const SettingsForm = (props: SettingsFormProps) => {
  let formRef!: HTMLFormElement;

  const { saveSettings, settings, setSettings } = useSettingsStoreContext();
  const { chessClockStore } = useChessClockStoreContext();

  const players: Player[] = [
    {
      legend: "Player 1 settings",
      playerSettings: settings.player1,
      key: "player1",
    },
    {
      legend: "Player 2 settings",
      playerSettings: settings.player2,
      key: "player2",
    },
  ];

  function passConfirmationGuard(target: HTMLInputElement, oldValue: string) {
    if (chessClockStore.chessClockState === "suspended") {
      const confirmChangeSetting = confirm(
        "There's a game going on. If you change this setting, the game will be restarted with the new settings."
      );

      if (!confirmChangeSetting) {
        target.value = oldValue;
        return false;
      }
    }

    return true;
  }

  async function onChangeIncrementBy(player: Player, event: Event & { target: HTMLInputElement }) {
    if (!passConfirmationGuard(event.target, settings[player.key].incrementBy.toString())) {
      return;
    }

    setSettings(player.key, "incrementBy", parseInt(event.target.value));
    await saveSettings();
  }

  async function onChangeStartTime(player: Player, event: Event & { target: HTMLInputElement }) {
    if (!passConfirmationGuard(event.target, (settings[player.key].startTime / 60).toString())) {
      return;
    }

    setSettings(player.key, "startTime", parseFloat(event.target.value) * 60);
    await saveSettings();
  }

  async function onChangeTheme(newValue: Theme) {
    setSettings("global", "theme", newValue);
    await saveSettings();
  }

  async function onChangeSoundOn(newValue: boolean) {
    setSettings("global", "soundOn", newValue);
    await saveSettings();
  }

  return (
    <form ref={formRef} class={styles.form} autocomplete="off">
      <div class={styles.playerSettingsContainer}>
        {players.map((player) => (
          <PlayerSettings
            incrementBy={{ value: player.playerSettings.incrementBy, min: 0, max: 36000 }}
            legend={player.legend}
            onChangeIncrementBy={[onChangeIncrementBy, player]}
            onChangeStartTime={[onChangeStartTime, player]}
            startTime={{ value: player.playerSettings.startTime / 60, min: 0.01, max: 600 }}
          />
        ))}
      </div>

      <GlobalSettings
        theme={settings.global.theme}
        soundOn={settings.global.soundOn}
        onChangeTheme={onChangeTheme}
        onChangeSoundOn={onChangeSoundOn}
      />

      <menu class={styles.optionsMenu}>
        <button class={styles.closeButton} type="button" onClick={props.onCancel} autofocus>
          Ok
        </button>
      </menu>
    </form>
  );
};