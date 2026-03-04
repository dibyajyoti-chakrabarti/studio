'use client';

import { useEffect, useState } from 'react';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents() {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    // Extract headings from the rendered MDX content
    useEffect(() => {
        const article = document.querySelector('.mdx');
        if (!article) return;

        const elements = article.querySelectorAll('h1, h2, h3');
        const items: TocItem[] = Array.from(elements)
            .filter((el) => el.id) // only headings with IDs (set by rehype-slug)
            .map((el) => ({
                id: el.id,
                text: el.textContent || '',
                level: Number(el.tagName.charAt(1)),
            }));

        setHeadings(items);
    }, []);

    // Track which heading is currently in view
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Find the first heading that is intersecting
                const visible = entries.find((e) => e.isIntersecting);
                if (visible?.target.id) {
                    setActiveId(visible.target.id);
                }
            },
            { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    const handleClick = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveId(id);
        }
    };

    if (headings.length === 0) return null;

    return (
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">
                On this page
            </h4>
            <nav
                className="max-h-[60vh] overflow-y-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
                <ul className="space-y-1">
                    {headings.map((heading) => {
                        const isActive = activeId === heading.id;
                        const indent = heading.level === 1 ? 'pl-0' : heading.level === 2 ? 'pl-0' : 'pl-3';

                        return (
                            <li key={heading.id}>
                                <button
                                    onClick={() => handleClick(heading.id)}
                                    className={`
                                        block w-full text-left py-1.5 text-[13px] leading-snug transition-all duration-200 border-l-2
                                        ${indent}
                                        ${isActive
                                            ? 'text-white font-semibold border-cyan-400 pl-3 bg-white/[0.03] rounded-r-lg'
                                            : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:border-zinc-700 pl-3'
                                        }
                                    `}
                                >
                                    {heading.text}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
