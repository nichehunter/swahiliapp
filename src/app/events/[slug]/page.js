import MapExperience from "@/pages/map/map";

export default async function EventSharedPage({ params }) {
  const { slug } = await params;

  return <MapExperience mode="shared" sharedEventSlug={slug} />;
}
