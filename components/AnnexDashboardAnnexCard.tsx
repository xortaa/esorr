import { Eye, Pencil } from "lucide-react";
import Link from "next/link";

interface AnnexDashboardAnnexCardProps {
  annexCode: string;
  annexTitle: string;
  annexStatus: string;
  annexEditLink: string;
  annexViewLink: string;
}

const AnnexDashboardAnnexCard = ({
  annexCode,
  annexTitle,
  annexStatus,
  annexEditLink,
  annexViewLink,
}: AnnexDashboardAnnexCardProps) => {
  return (
    <div className="flex justify-between items-center p-4 hover:shadow-lg cursor-pointer">
      <div className="flex items-center justify-center gap-4">
        <span className="text-xl font-bold bg-slate-300 w-10 h-10 flex items-center justify-center rounded-full opacity-40">
          <p>{annexCode}</p>
        </span>
        <div>
          <p className="text-xl">{annexTitle}</p>
          <p className="text-xs">{annexStatus}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Link href={annexEditLink}>
          <button className="btn ghost">
            <Pencil />
            Edit
          </button>
        </Link>
        <Link href={annexViewLink}>
          <button className="btn btn-primary">
            <Eye />
            <p>View</p>
          </button>
        </Link>
      </div>
    </div>
  );
};
export default AnnexDashboardAnnexCard;
