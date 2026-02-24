import type { RefObject } from "react";
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";

type TimeContextValue = {
	isRotating: boolean;
	toggleRotation: () => void;

	isPlaying: boolean;
	togglePlay: () => void;

	timeSpeed: number;
	setTimeSpeed: (v: number) => void;

	isAllMode: boolean;
	toggleAllMode: () => void;

	currentTimeRef: RefObject<number>;
	currentDate: Date;

	setCurrentTime: (v: number) => void;
	resetTime: () => void;
};

const TimeContext = createContext<TimeContextValue | null>(null);

const START_MS = Date.UTC(1900, 0, 1);
const END_MS = Date.UTC(2026, 0, 1);
const DURATION = END_MS - START_MS;

export function TimeProvider({ children }: PropsWithChildren) {
	const [isRotating, setIsRotating] = useState(true);
	const [isPlaying, setIsPlaying] = useState(true);
	const [timeSpeed, setTimeSpeedState] = useState(1);
	const [isAllMode, setIsAllMode] = useState(false);

	const currentTimeRef = useRef(0);
	const [currentDate, setCurrentDate] = useState<Date>(new Date(START_MS));

	const prevPlayingRef = useRef(true);

	const toggleRotation = useCallback(() => {
		setIsRotating((p) => !p);
	}, []);

	const togglePlay = useCallback(() => {
		setIsPlaying((p) => !p);
	}, []);

	const setTimeSpeed = useCallback((v: number) => {
		setTimeSpeedState(v);
	}, []);

	const setCurrentTime = useCallback((v: number) => {
		const next = Math.min(Math.max(v, 0), 1);
		currentTimeRef.current = next;

		const ms = START_MS + next * DURATION;
		setCurrentDate(new Date(ms));
	}, []);

	const resetTime = useCallback(() => {
		currentTimeRef.current = 0;
		setCurrentDate(new Date(START_MS));
	}, []);

	const toggleAllMode = useCallback(() => {
		setIsAllMode((prev) => {
			const next = !prev;

			if (next) {
				prevPlayingRef.current = isPlaying;
				setIsPlaying(false);
			} else {
				setIsPlaying(prevPlayingRef.current);
			}

			return next;
		});
	}, [isPlaying]);

	const value = useMemo<TimeContextValue>(
		() => ({
			isRotating,
			toggleRotation,
			isPlaying,
			togglePlay,
			timeSpeed,
			setTimeSpeed,
			isAllMode,
			toggleAllMode,
			currentTimeRef,
			currentDate,
			setCurrentTime,
			resetTime,
		}),
		[
			isRotating,
			toggleRotation,
			isPlaying,
			togglePlay,
			timeSpeed,
			setTimeSpeed,
			isAllMode,
			toggleAllMode,
			currentDate,
			setCurrentTime,
			resetTime,
		],
	);

	return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
}

export function useTime() {
	const ctx = useContext(TimeContext);
	if (!ctx) throw new Error("useTime must be used inside <TimeProvider>");
	return ctx;
}
