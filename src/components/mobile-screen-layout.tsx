import type { PropsWithChildren } from 'react';

export function MobileScreenLayout({ children }: PropsWithChildren) {
    return (
        <main className="min-h-dvh bg-relink-white">
            <section className="relative mx-auto min-h-dvh w-full max-w-[430px] bg-relink-white">
                {children}
            </section>
        </main>
    );
}