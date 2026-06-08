import { Button } from "@/components/ui/button";

const CreateStartupPage = () => {
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Submit Your Startup</h1>
        <p className="sub-heading !max-w-3xl">
          Share your idea and help other founders discover what you are building.
        </p>
      </section>

      <section className="section_container">
        <form className="startup-form">
          <div>
            <label htmlFor="title" className="startup-form_label">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="Startup title"
              className="startup-form_input w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="startup-form_label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              placeholder="Short description of your startup"
              className="startup-form_textarea w-full"
              rows={5}
            />
          </div>

          <div>
            <label htmlFor="category" className="startup-form_label">
              Category
            </label>
            <input
              id="category"
              name="category"
              required
              placeholder="Robots, AI, Fintech..."
              className="startup-form_input w-full"
            />
          </div>

          <div>
            <label htmlFor="image" className="startup-form_label">
              Image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              required
              placeholder="https://example.com/image.png"
              className="startup-form_input w-full"
            />
          </div>

          <div>
            <label htmlFor="pitch" className="startup-form_label">
              Pitch
            </label>
            <textarea
              id="pitch"
              name="pitch"
              required
              placeholder="Tell people why this should exist"
              className="startup-form_textarea w-full"
              rows={8}
            />
          </div>

          <Button type="submit" className="startup-form_btn">
            Submit Your Pitch
          </Button>
        </form>
      </section>
    </>
  );
};

export default CreateStartupPage;
