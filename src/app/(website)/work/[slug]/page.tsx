import CaseStudy from "@/components//Casestudy";
import { notFound } from "next/navigation";
import { CASE_STUDIES } from "@/components//CaseStudies";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const index = CASE_STUDIES.findIndex(
    (item) => item.slug === slug
  );

  if (index === -1) notFound();

  const data = CASE_STUDIES[index];
  const nextProject =
    CASE_STUDIES[(index + 1) % CASE_STUDIES.length];

  return (
    <CaseStudy
      data={data}
      next={{
        name: nextProject.title.join(" "),
        href: `/work/${nextProject.slug}`,
      }}
    />
  );
}