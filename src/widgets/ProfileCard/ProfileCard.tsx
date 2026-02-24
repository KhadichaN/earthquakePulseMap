import { useEffect } from "react";
import profileImg from "@/shared/assets/images/profile.webp";
import styles from "./styles.module.scss";

interface LinkItem {
	label: string;
	href: string;
}

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export default function ProfileCard({ isOpen, onClose }: Props) {
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEsc);
		}

		return () => {
			document.removeEventListener("keydown", handleEsc);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const links: LinkItem[] = [
		{ label: "GitHub", href: "https://github.com/KhadichaN" },
		{ label: "LinkedIn", href: "https://www.linkedin.com/in/khadicha-n" },
	];

	return (
		<div className={styles.overlay}>
			<button
				type="button"
				className={styles.backdrop}
				onClick={onClose}
				aria-label="Close profile card"
			/>
			<div className={styles.card}>
				<div className={styles.imageWrapper}>
					<img src={profileImg} alt="Profile" />
					<div className={styles.imageOverlay} />
				</div>

				<div className={styles.content}>
					<h2>Khadichabegim Naymanova</h2>
					<p className={styles.subtitle}>
						Frontend Developer · React · TypeScript · WebGL · ArcGIS JS SDK
					</p>

					<div className={styles.links}>
						{links.map((link) => (
							<a
								key={link.label}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.linkBtn}
							>
								{link.label}
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
