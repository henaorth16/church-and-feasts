import { formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";

type FormattedDateProps = {
    date: Date;
  };
  
  export default function FormattedDate({ date }: FormattedDateProps) {
    const locale = useLocale()
    const formattedDate = formatDate(date, locale);
    return <span>{formattedDate}</span>;
  }
  