import Image from "next/image";

const AvatarBubble = ({ image }: { image: string }) => {
  return (
    <div className="avatar">
      {!image ? (
        <Image src="/assets/Default_pfp.png" className="rounded-full" width={25} height={25} alt="avatar" />
      ) : (
        <Image src={image} className="rounded-full" width={25} height={25} alt="avatar" />
      )}
    </div>
  );
};
export default AvatarBubble;
