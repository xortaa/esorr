import Link from "next/link";

interface AnnexDashboardAnnexCardProps {
  annexCode: string;
  annexTitle: string;
  annexLink: string;
}

const AnnexDashboardAnnexCard = ({ annexCode, annexTitle, annexLink }: AnnexDashboardAnnexCardProps) => {
  return (
    <Link href={annexLink} className="flex justify-between items-center p-4 hover:shadow-md hover:bg-white">
      <div className="flex items-center justify-center gap-4">
        <span className="text-xl font-bold bg-slate-300 w-10 h-10 flex items-center justify-center rounded-full opacity-40">
          <p>{annexCode}</p>
        </span>
        <div>
          <p className="text-xl">{annexTitle}</p>
        </div>
      </div>
    </Link>
  );
};
export default AnnexDashboardAnnexCard;
