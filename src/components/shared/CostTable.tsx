type Row = { label: string; value: string; note?: string };

type Props = {
  caption?: string;
  rows: readonly Row[];
};

export default function CostTable({ caption, rows }: Props) {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto border border-stone-200">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i === 0 ? "" : "border-t border-stone-200"}>
                <td className="py-4 pl-5 pr-6 align-top font-medium text-charcoal whitespace-nowrap">
                  {row.label}
                </td>
                <td className="py-4 pr-5 align-top text-charcoal-light">
                  {row.value}
                  {row.note && <span className="block mt-1 text-xs text-stone-500">{row.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <p className="mt-3 text-xs text-stone-500">{caption}</p>}
    </div>
  );
}
