import type { ParentComponent, VoidComponent, JSX } from "solid-js";

import Drawer from "@corvu/drawer";
import { AiFillCloseCircle } from "solid-icons/ai";
import { useOrientation } from "../../../hooks/useOrientation";

import styles from "./SettingsDrawer.module.scss";

type SettingsDrawerProps = {
  openButton: VoidComponent<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;
  label: string;
};

export const SettingsDrawer: ParentComponent<SettingsDrawerProps> = (props) => {
  const orientation = useOrientation();

  return (
    <Drawer breakPoints={[0.75]} side={orientation() === "portrait" ? "bottom" : "top"}>
      {(drawerProps) => (
        <>
          <Drawer.Trigger as={props.openButton} />
          <Drawer.Portal>
            <Drawer.Overlay
              class={styles.overlay}
              style={{
                "background-color": `rgb(0 0 0 / ${0.5 * drawerProps.openPercentage})`,
              }}
            />
            <Drawer.Content class={styles.dialog}>
              <div class={styles.notch} />
              <header class={styles.header}>
                <Drawer.Label class={styles.label}>{props.label}</Drawer.Label>
                <Drawer.Close class={styles.closeButton}>
                  <AiFillCloseCircle />
                </Drawer.Close>
              </header>
              <div class={styles.contentContainer}>{props.children}</div>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer>
  );
};
