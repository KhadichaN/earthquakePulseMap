import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import profileIcon from "@/shared/assets/icons/profile.svg";
import { TimeProvider, useTime } from "@/shared/context/TimeContext";
import TimelineChartAm from "@/widgets/TimelineChart/TimelineChartAm";
import DateCard from "../DateCard/DateCard";
import InfoPanels from "../InfoPanels/InfoPanels";
import ProfileCard from "../ProfileCard/ProfileCard";
import GlobeContent from "./GlobeContent";
import styles from "./GlobeScene.module.scss";
import GlobeControls from "./ui/GlobeControls";

export default function GlobeScene() {
	return (
		<TimeProvider>
			<GlobeSceneInner />
		</TimeProvider>
	);
}

function GlobeSceneInner() {
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false,
	);
	const [isInfoOpen, setIsInfoOpen] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth >= 768 : true,
	);

	const { mode, setMode } = useTime();

	// const { resetTime } = useTime();
	useEffect(() => {
		const media = window.matchMedia("(max-width: 767px)");

		const handleResize = () => {
			const mobile = media.matches;
			setIsMobile(mobile);
			setIsInfoOpen(!mobile);
		};

		handleResize();
		media.addEventListener("change", handleResize);

		return () => {
			media.removeEventListener("change", handleResize);
		};
	}, []);

	return (
		<div className={styles.canvasWrapper}>
			<Canvas frameloop="always" camera={{ position: [0, 0, 4], fov: 30 }}>
				<GlobeContent />
			</Canvas>

			<div className={styles.modeSwitch}>
				<button
					type="button"
					className={`${styles.segment} ${
						mode === "historic" ? styles.activeSegment : ""
					}`}
					onClick={() => setMode("historic")}
				>
					Historic
				</button>

				<button
					type="button"
					className={`${styles.segment} ${
						mode === "week" ? styles.activeSegment : ""
					}`}
					onClick={() => setMode("week")}
				>
					Last 7 days
				</button>
			</div>

			<button
				type="button"
				className={styles.profileBtn}
				onClick={() => setIsProfileOpen(true)}
			>
				<img src={profileIcon} alt="Profile" />
			</button>
			{isMobile && !isInfoOpen && (
				<button
					type="button"
					className={styles.infoBtn}
					onClick={() => setIsInfoOpen(true)}
					aria-label="Open info panels"
				>
					<span aria-hidden="true">i</span>
				</button>
			)}

			<ProfileCard
				isOpen={isProfileOpen}
				onClose={() => setIsProfileOpen(false)}
			/>
			<div className={styles.mobileOnly}>
				<DateCard />
			</div>
			{(!isMobile || isInfoOpen) && (
				<InfoPanels
					showMobileClose={isMobile}
					onMobileClose={() => setIsInfoOpen(false)}
				/>
			)}
			<div className={styles.desktopOnly}>
				<TimelineChartAm />
			</div>
			<GlobeControls />
		</div>
	);
}
