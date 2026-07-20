import { useTranslations } from "next-intl";

export default function AiLabel({
  position = "bottom-right",
}: {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}) {
  const t = useTranslations("AiLabel");

  const positions = {
    "bottom-right": "bottom-3 right-3",
    "bottom-left": "bottom-3 left-3",
    "top-right": "top-3 right-3",
    "top-left": "top-3 left-3",
  };

  return (
    <span
      className={`absolute ${positions[position]} z-20 rounded-sm bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-bone backdrop-blur-sm`}
    >
      {t("badge")}
    </span>
  );
}