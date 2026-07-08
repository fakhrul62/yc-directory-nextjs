import SearchForm from "../../components/SearchForm";
import StartupCard from "@/components/StartupCard";
import { getStartups } from "@/lib/startups";

export const dynamic = "force-dynamic";

export default async function Home({searchParams} : {searchParams: Promise <{ query?: string }>}) {
  const query = (await searchParams).query;
  const posts = await getStartups(query);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>
        <SearchForm query={query}></SearchForm>
      </section>

      <section className="section_container">
        <p className="text-3xl font-semibold">
          {query ? `Search results  for "${query}"` : 'All Startups'}
        </p>
        <ul className="mt-7 card_grid">
        { posts?.length > 0 ? 
          (
            posts.map((post)=>
              <StartupCard key={post?._id} post={post}/>
          )
        ) : (
            <p className="no-result">No startups found</p>
          )
        }
        </ul>
      </section>
    </>
  );
}
