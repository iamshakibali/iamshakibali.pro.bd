import { content } from "@/lib/content";

export function ProjectsSection() {
  return (
    <section className="w-full">
      <p className="text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        Currently, what&apos;s in my{" "}
        <span className="font-medium text-black dark:text-white">Focus</span>.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {content.projects.map((project) => {
          const Wrapper = project.note ? "div" : "a";
          const wrapperProps = project.note
            ? { className: "group relative overflow-hidden rounded-lg border border-dashed border-neutral-200/40 bg-neutral-100/70 transition-colors duration-300 hover:border-neutral-400 hover:bg-neutral-200/70 cursor-default dark:border-neutral-800/50 dark:bg-neutral-800/60 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/80" }
            : { href: project.url, target: "_blank", rel: "noopener noreferrer", className: "group relative overflow-hidden rounded-lg border border-dashed border-neutral-200/40 bg-neutral-100/70 transition-colors duration-300 hover:border-neutral-400 hover:bg-neutral-200/70 dark:border-neutral-800/50 dark:bg-neutral-800/60 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/80" };
          return (
            <Wrapper key={project.name} {...wrapperProps}>
            <img
              src={project.image}
              alt={`${project.name} preview`}
              draggable={false}
              className="block h-[145px] w-full object-cover"
            />
            <div className="flex items-center gap-2 px-3 pt-2.5">
              <span className="text-[14px] font-medium text-black dark:text-white">
                {project.name}
              </span>
              {project.note && (
                <span className="inline-block rounded-full bg-neutral-200 px-2 py-0.5 font-mono text-[9px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {project.note}
                </span>
              )}
            </div>
            <p className="whitespace-pre-line px-3 pb-3 pt-1 font-mono text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {project.description}
            </p>
          </Wrapper>
          );
        })}
      </div>
    </section>
  );
}