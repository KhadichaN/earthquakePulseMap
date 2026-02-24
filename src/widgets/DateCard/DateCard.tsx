import { useMemo } from "react";
import { useTime } from "@/shared/context/TimeContext";
import styles from "./styles.module.scss";

function pad2(n: number) {
	return String(n).padStart(2, "0");
}

export default function DateCard() {
	const { isAllMode, currentDate } = useTime();

	const label = useMemo(() => {
		if (isAllMode) return "1900.01 — 2026.01";

		const yyyy = currentDate.getUTCFullYear();
		const mm = pad2(currentDate.getUTCMonth() + 1);

		return `${yyyy}.${mm}`;
	}, [isAllMode, currentDate]);

	return <div className={styles.card}>{label}</div>;
}
