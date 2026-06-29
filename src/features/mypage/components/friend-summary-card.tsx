type FriendSummaryCardProps = {
    friendCount: number;
};

export function FriendSummaryCard({ friendCount }: FriendSummaryCardProps) {
    return (
        <section className="mx-5 rounded-lg bg-relink-white px-8 py-7 shadow-relink-card">
            <div className="flex items-center gap-5">
                <p className="font-display text-[20px] leading-7 text-relink-gray-400">
                    친구 <span className="text-relink-gray-700">{friendCount}명</span>
                </p>
                <button
                    type="button"
                    className="rounded-lg bg-relink-lavender-soft px-3 py-1 font-display text-md text-relink-gray-700"
                >
                    친구 관리
                </button>
            </div>
        </section>
    );
}
