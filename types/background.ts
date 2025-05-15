export type Position = {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    animationDelay?: string;
};

export type CloudConfig = {
    position: Position;
    size: {
        width: string;
        height: string;
    };
    zIndex?: number;
    className?: string;
};

export type SunConfig = {
    position: Position;
    size: {
        width: string;
        height: string;
    };
    zIndex?: number;
    className?: string;
    image: string;
};

export type BackgroundConfig = {
    starPositions: Position[];
    animationVariants: string[];
    clouds: {
        one: CloudConfig;
        two: CloudConfig;
    };
    suns: {
        left: SunConfig;
        right: SunConfig;
    };
};