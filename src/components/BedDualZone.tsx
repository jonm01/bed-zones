/**
 * BedDualZone renders a bed split into left and right zones.
 * Each zone can be off, cooling, or heating. The component highlights
 * the zone currently being edited and shows which zone is selected.
 */
import React from "react";
import styles from "./BedDualZone.module.css";

export type ZoneStatus = "off" | "cooling" | "heating";

export interface BedDualZoneProps {
  leftStatus: ZoneStatus;
  rightStatus: ZoneStatus;
  selectedSide?: "left" | "right";
  editingSide?: "left" | "right";
}

export default function BedDualZone({
  leftStatus,
  rightStatus,
  selectedSide,
  editingSide,
}: BedDualZoneProps) {
  return (
    <div className={styles.bed}>
      <div
        className={[
          styles.zone,
          styles[leftStatus],
          editingSide === "left" ? styles.editing : "",
        ].join(" ")}
      >
        {selectedSide === "left" && (
          <span className={styles.selected}>✓</span>
        )}
      </div>
      <div
        className={[
          styles.zone,
          styles[rightStatus],
          editingSide === "right" ? styles.editing : "",
        ].join(" ")}
      >
        {selectedSide === "right" && (
          <span className={styles.selected}>✓</span>
        )}
      </div>
    </div>
  );
}
