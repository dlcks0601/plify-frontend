export default function ProviderPage({
  params,
}: {
  params: { provider: string };
}) {
  return <div>OAuth Provider: {params.provider}</div>;
}
