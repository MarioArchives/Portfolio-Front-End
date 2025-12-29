import type { FC } from "react";

interface FlagImageProperties {
    code: string;
}
export const FlagImage: FC<FlagImageProperties> = ({ code }) => {
    let src = "";
    if (code === "default") {
        src = `./defaultCountryImage.png`;
    } else {
        const normalized = String(code).trim().toLowerCase();
        src = `https://flagcdn.com/${normalized}.svg`;
    }

    return <img src={src} className="SudokuFlagContainer" loading="lazy" />;
};
