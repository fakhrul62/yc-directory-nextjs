import SearchForm from "../../components/SearchForm";
import StartupCard from "@/components/StartupCard";

export default async function Home({searchParams} : {searchParams: Promise <{ query?: string }>}) {
  const query = (await searchParams).query;
  const posts = [{
    _id: 1,
    _createdAt: new Date(),
    views: 120,
    author: {
      id: 1,
      name: 'John Doe'
    },
    description: 'This is a description',
    image: 'https://st2.depositphotos.com/3228285/6005/i/450/depositphotos_60054725-stock-photo-robot-lying-on-floor-and.jpg',
    category: 'Robots',
    title: 'We Robots'
  }]
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
            posts.map((post: StartupCardType)=>
              <StartupCard key={post?._id} post={post}/>
          )
        ) : (
            <p className="no-results">No startups found</p>
          )
        }
        </ul>
      </section>
    </>
  );
}
