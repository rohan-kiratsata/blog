import { freelanceProjects } from "app/util/content";
import { ProjectPreviewLink } from "app/components/project-preview";
import { MarqueeCarousel } from "app/components/marquee-carousel";

export const metadata = {
  title: "Side Quest | Freelance Projects",
  description: "Freelance projects and client work by Rohan Kiratsata",
};

export default function SideQuestPage() {
  return (
    <>
      <div className="max-w-xl">
        <div className="flex-1 w-full gap-4 grid grid-cols-1">
          <h2 className="text-base text-neutral-400 dark:text-neutral-500 mb-2 font-medium">
            dev gigs
          </h2>
          {freelanceProjects.map((project) => (
            <ProjectPreviewLink key={project.title} project={project} />
          ))}
        </div>
      </div>

      {/* <div className="mt-5 w-full">
        <div className="max-w-xl mb-4">
          <h2 className="font-mono">[design gigs]</h2>
        </div>
        <MarqueeCarousel
          images={[
            {
              src: "/previews/deepprcover.png",
              alt: "Deep PR Cover",
              width: 1000,
              height: 1000,
            },
            {
              src: "/previews/lp.png",
              alt: "LP Design",
              width: 1000,
              height: 1000,
            },
            {
              src: "/previews/dirah.png",
              alt: "Dirah Design",
              width: 1000,
              height: 1000,
            },
            {
              src: "/previews/auralam.png",
              alt: "Auralam Design",
              width: 1000,
              height: 1000,
            },
          ]}
        />
      </div> */}
    </>
  );
}
