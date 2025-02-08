/* eslint-disable @next/next/no-img-element */
import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  const {
    image,
    author,
    _createdAt,
    views,
    description,
    title,
    category,
    _id,
  } = post;
  return (
    <li className="startup-card group">
      <div className="flex justify-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex  gap-1">
          <EyeIcon className="text-lg text-primary" />
          <span className="font-medium">{views}</span>
        </div>
      </div>
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="font-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/startup/${_id}`}>
            <h3 className="font-semibold text-2xl">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          <Image
            src="https://placehold.co/600x400"
            alt="placeholder"
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>
      <Link href={`/startup/${_id}`}>
        <p className="startup_card_desc my-3">{description}</p>
        <img src={image} alt="placeholder" className="startup-card_img" />
      </Link>
      <div className="flex-between gap-3 mt-5">
      <Link href={`/?query=${category.toLowerCase()}`}>
        <p className="font-medium">{category}</p>
      </Link>
      <Button className="startup-card_btn" asChild>
        <Link href={`/startup/${_id}`}>Details</Link>
      </Button>
      </div>
    </li>
  );
};

export default StartupCard;
