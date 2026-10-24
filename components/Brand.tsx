import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Brand() {
  const t = useTranslations("brand");
  return (
    <Link className="brand" href="/">
      <Image className="brand__mark" src="/mark.svg" alt="" width={42} height={42} loading="eager" />
      <span className="brand__text">
        <span className="brand__name">Rehan Salt</span>
        <span className="brand__tag">{t("tag")}</span>
      </span>
    </Link>
  );
}
