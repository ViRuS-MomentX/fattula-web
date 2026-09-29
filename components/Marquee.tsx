/** A slow ribbon of topics. The list is rendered twice so the loop is seamless. */
export default function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const row = (hidden: boolean) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
  return (
    <section className="marquee" aria-label="Темы постов и проектов">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
