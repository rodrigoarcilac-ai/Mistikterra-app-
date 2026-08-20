import InquiryForm from "@/components/InquiryForm";
import { destinations } from "@/lib/destinations";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-[0.3em] text-stone-900">
            MISTIKTERRA
          </span>
        </div>
        <a
          href="#inquiry"
          className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900"
        >
          Plan a journey
        </a>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-900 via-stone-900 to-amber-900 opacity-95" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-amber-300">
            Bespoke luxury travel
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-stone-50 sm:text-6xl">
            Journeys designed around the way you dream of the world.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-200">
            Mistikterra crafts private, personalized itineraries to the world&apos;s
            most extraordinary places — every detail arranged, nothing left to
            chance.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#inquiry"
              className="rounded-full bg-amber-300 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-stone-900 transition hover:bg-amber-200"
            >
              Start planning
            </a>
            <a
              href="#destinations"
              className="rounded-full border border-stone-100/40 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-stone-100 transition hover:bg-white/10"
            >
              Explore destinations
            </a>
          </div>
        </div>
      </section>

      <section id="destinations" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-700">
              Curated destinations
            </p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              A world of signature experiences
            </h2>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <article
              key={destination.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="h-40 w-full"
                style={{
                  background: `linear-gradient(135deg, ${destination.accent}, #1c1917)`,
                }}
                aria-hidden
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold">{destination.name}</h3>
                  <span className="text-sm font-medium uppercase tracking-wide text-stone-500">
                    {destination.country}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  {destination.tagline}
                </p>
                <p className="mt-3 flex-1 text-sm leading-6 text-stone-600">
                  {destination.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {destination.experiences.map((experience) => (
                    <li
                      key={experience}
                      className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700"
                    >
                      {experience}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm text-stone-500">
                  From{" "}
                  <span className="font-semibold text-stone-900">
                    ${destination.fromPriceUsd.toLocaleString()}
                  </span>{" "}
                  per person
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="inquiry" className="bg-stone-100 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-700">
              Design your journey
            </p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Tell us your dream. We&apos;ll handle everything else.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-8 text-stone-600">
              Share a few details and a private travel designer will build a
              personalized proposal, complete with exclusive stays and
              once-in-a-lifetime experiences.
            </p>
            <dl className="mt-8 space-y-4 text-stone-700">
              <div>
                <dt className="font-semibold">Personal designer</dt>
                <dd className="text-stone-600">
                  One dedicated expert from first idea to final journey.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Exclusive access</dt>
                <dd className="text-stone-600">
                  Private villas, after-hours tours, and tables that don&apos;t
                  exist to the public.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Effortless travel</dt>
                <dd className="text-stone-600">
                  Every transfer, reservation, and surprise arranged in advance.
                </dd>
              </div>
            </dl>
          </div>

          <InquiryForm destinations={destinations} />
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-stone-500 sm:flex-row">
          <span className="tracking-[0.3em] text-stone-700">MISTIKTERRA</span>
          <span>Personalized luxury travel, designed around you.</span>
        </div>
      </footer>
    </div>
  );
}
