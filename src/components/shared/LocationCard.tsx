type Props = {
  name: string;
  description: string;
  id?: string;
};

export default function LocationCard({ name, description, id }: Props) {
  return (
    <div id={id} className="border border-stone-200 p-8 scroll-mt-28">
      <h3 className="text-2xl font-serif">{name}</h3>
      <p className="mt-4 text-sm leading-relaxed text-charcoal-light">{description}</p>
    </div>
  );
}
