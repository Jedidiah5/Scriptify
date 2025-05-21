export const VIDEO_FORMATS = ["TikTok", "Instagram Reel", "YouTube Short"] as const;
export const VIDEO_STYLES = ["Listicle", "Skit", "Storytime", "How-To"] as const;

export type VideoFormat = typeof VIDEO_FORMATS[number];
export type VideoStyle = typeof VIDEO_STYLES[number];

export const DEFAULT_FORMAT: VideoFormat = "TikTok";
export const DEFAULT_STYLE: VideoStyle = "Listicle";
