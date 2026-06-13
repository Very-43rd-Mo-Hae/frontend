import { type RingColor, ringColorMap } from '@/features/home/constants/ring-colors';

const recommendationCards = [
  {
    title: '추천 1',
    date: '06/10 (일)',
    names: ['김마영', '김바영', '김사영', '김아영'],
    bars: [
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'yellow', 'yellow'],
    ],
    shadow: true,
  },
  {
    title: '추천 2',
    date: '06/09 (토)',
    names: ['김가영', '김나영', '김다영', '김라영'],
    bars: [
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'yellow'],
      ['yellow', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
    ],
    shadow: false,
  },
] as const;

export function RecommendationSection() {
  return (
    <>
      <div className="flex h-[39px] items-end justify-end pb-2 pr-[5px]">
        <p className="font-display text-sm text-black/70">추천 더보기</p>
      </div>

      <section className="flex">
        {recommendationCards.map((card) => (
          <RecommendationCard key={card.title} {...card} />
        ))}
      </section>
    </>
  );
}

type RecommendationCardProps = (typeof recommendationCards)[number];

function RecommendationCard({ title, date, names, bars, shadow }: RecommendationCardProps) {
  return (
    <article
      className={`h-[197px] w-[172px] rounded border border-relink-card bg-relink-white px-[15px] pt-3.5 ${
        shadow ? 'shadow-relink-card' : ''
      }`}
    >
      <div className="flex h-5 items-center gap-[13px]">
        <h2 className="font-display text-md text-relink-ink">{title}</h2>
        <span className="flex h-5 min-w-[58px] items-center justify-center rounded-full bg-relink-lavender-soft px-2 font-display text-sm text-relink-gray-700">
          약속 잡기
        </span>
      </div>
      <div className="mt-[3px] flex items-center gap-2">
        <p className="font-display text-sm text-relink-gray-700">{date}</p>
        <p className="font-display text-sm text-relink-gray-400">
          18:00 - 22:00
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {names.map((name, index) => (
          <div key={name} className="flex h-[28px] flex-col items-center justify-between">
            <p className="font-display text-sm text-relink-ink">{name}</p>
            {index < bars.length ? (
              <ProgressRow colors={bars[index]} />
            ) : (
              <div className="h-[5px] w-[142px]" />
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

function ProgressRow({ colors }: { colors: readonly RingColor[] }) {
  return (
    <div className="flex h-[5px] w-[142px]">
      {colors.map((color, index) => (
        <div
          key={`${color}-${index}`}
          className="h-[5px] w-[17.75px] rounded-[2px]"
          style={{ backgroundColor: ringColorMap[color] }}
        />
      ))}
    </div>
  );
}
