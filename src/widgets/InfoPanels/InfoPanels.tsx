import closeIcon from "@/shared/assets/icons/close.svg";
import { useTime } from "@/shared/context/TimeContext";
import DepthLegend from "./DepthLegend";
import MagnitudeLegend from "./MagnitudeLegend";
import SummaryCard from "./SummaryCard";
import styles from "./styles.module.scss";
import { useInfoStats } from "./useInfoStats";

interface InfoPanelsProps {
	showMobileClose?: boolean;
	onMobileClose?: () => void;
}

export default function InfoPanels({
	showMobileClose = false,
	onMobileClose,
}: InfoPanelsProps) {
	const stats = useInfoStats();
	const { mode } = useTime();

	return (
		<div className={styles.wrapper}>
			{showMobileClose && (
				<button
					type="button"
					className={styles.closeBtn}
					onClick={onMobileClose}
				>
					<img src={closeIcon} alt="Close info panels" />
				</button>
			)}
			<SummaryCard stats={stats} mode={mode} />
			<DepthLegend stats={stats} mode={mode} />
			<MagnitudeLegend stats={stats} mode={mode} />
		</div>
	);
}
