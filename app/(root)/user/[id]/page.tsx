import StartupCard from "@/components/StartupCard";
import { getAuthorById, getStartupsByAuthor } from "@/lib/startups";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const authorId = Number(id);
  const author = await getAuthorById(authorId);

  if (!author) {
    notFound();
  }

  const startups = await getStartupsByAuthor(authorId);

  return (
    <section className="profile_container">
      <aside className="profile_card">
        <div className="profile_title">
          <h1 className="text-24-black uppercase text-center line-clamp-1">
            {author.name}
          </h1>
        </div>

        <Image
          src="https://placehold.co/220x220"
          alt={author.name}
          width={220}
          height={220}
          className="profile_image"
        />

        <p className="mt-7 text-center font-medium">
          Founder profile for submitted startups.
        </p>
      </aside>

      <div className="flex-1">
        <p className="text-30-bold">Startups</p>

        <ul className="card_grid-sm mt-7">
          {startups.length > 0 ? (
            startups.map((startup) => (
              <StartupCard key={startup._id} post={startup} />
            ))
          ) : (
            <p className="no-result">No startups found</p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default UserProfilePage;
