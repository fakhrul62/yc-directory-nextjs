import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getStartupById } from "@/lib/startups";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const StartupDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const startup = await getStartupById(Number(id));

  if (!startup) {
    notFound();
  }

  return (
    <>
      <section className="pink_container !min-h-[260px]">
        <p className="tag">{startup.category}</p>
        <h1 className="heading">{startup.title}</h1>
        <p className="sub-heading !max-w-3xl">{startup.description}</p>
      </section>

      <section className="section_container">
        <Image
          src={startup.image}
          alt={startup.title}
          width={1200}
          height={700}
          className="w-full max-h-[520px] rounded-[22px] border-[5px] border-black object-cover"
        />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <Link href={`/user/${startup.author._id}`}>
              <p className="text-26-semibold">{startup.author.name}</p>
            </Link>
            <p className="text-black-100">{formatDate(startup._createdAt)}</p>
          </div>

          <div className="flex items-center gap-2 rounded-[22px] bg-primary-100 px-5 py-3">
            <EyeIcon className="size-5 text-primary" />
            <span className="font-semibold">{startup.views}</span>
          </div>
        </div>

        <hr className="divider" />

        <article className="prose max-w-4xl font-work-sans">
          <h2>Pitch</h2>
          <p>{startup.pitch}</p>
        </article>

        <Button className="startup-card_btn mt-10" asChild>
          <Link href="/">Back to Startups</Link>
        </Button>
      </section>
    </>
  );
};

export default StartupDetailsPage;
