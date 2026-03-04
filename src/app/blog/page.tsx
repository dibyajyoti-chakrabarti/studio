'use client';

import { useState, useMemo } from 'react';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { Search, SlidersHorizontal, ArrowRight, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogCard } from '@/components/BlogCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Get all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        allPosts.forEach(post => post.tags?.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }, []);

    // Filter and Sort Posts
    const posts = useMemo(() => {
        let filtered = allPosts
            .filter(post => post.published)
            .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

        if (selectedTag) {
            filtered = filtered.filter(post => post.tags?.includes(selectedTag));
        }

        if (!searchQuery) return filtered;

        const fuse = new Fuse(filtered, {
            keys: ['title', 'summary', 'tags'],
            threshold: 0.3,
        });

        return fuse.search(searchQuery).map(result => result.item);
    }, [searchQuery, selectedTag]);

    return (
        <BlogLayout>
            <div className="space-y-12">
                {/* Blog Hero */}
                <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">
                        Manufacturing Insights
                    </Badge>
                    <h1 className="text-center font-libre font-bold tracking-tight text-balance leading-[1.1] text-3xl md:text-4xl lg:text-5xl text-white mb-8">
                        MechHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Chronicles</span>
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Expert insights into CNC machining, additive manufacturing, and the future of industrial engineering.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-center sticky top-24 z-20 bg-zinc-950/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            type="text"
                            placeholder="Search articles, technical guides..."
                            className="pl-10 h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-zinc-600 focus:ring-blue-500/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="relative w-full sm:w-auto shrink-0">
                        <select
                            value={selectedTag || ''}
                            onChange={(e) => setSelectedTag(e.target.value || null)}
                            className="appearance-none w-full sm:w-52 h-11 pl-4 pr-10 rounded-xl bg-white/[0.03] border border-white/10 text-sm font-medium text-zinc-300 cursor-pointer transition-all hover:bg-white/[0.06] hover:border-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                        >
                            <option value="" className="bg-zinc-900 text-zinc-300">All Topics</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag} className="bg-zinc-900 text-zinc-300">
                                    {tag} ({allPosts.filter(p => p.published && p.tags?.includes(tag)).length})
                                </option>
                            ))}
                        </select>
                        {/* Custom chevron icon */}
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, i) => (
                            <BlogCard key={post._id} post={post} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
                            <Search className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white">No articles found</h3>
                        <p className="text-zinc-500">Try adjusting your search or filters to find what you're looking for.</p>
                        <Button
                            variant="outline"
                            className="mt-4 border-white/10 text-zinc-400 hover:text-white"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedTag(null);
                            }}
                        >
                            Clear all filters
                        </Button>
                    </div>
                )}

                {/* Newsletter / CTA Section */}
                <div className="mt-32 relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-blue-600/10 via-zinc-950 to-zinc-950 p-12 text-center border-t border-t-blue-500/20">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl font-bold text-white italic font-heading tracking-tight leading-tight">
                            Get the latest manufacturing tech news <br /> delivered to your inbox.
                        </h2>
                        <p className="text-zinc-400">Join 5,000+ engineers receiving bi-weekly deep dives into hardware innovation.</p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Input
                                className="h-12 bg-white/5 border-white/10 rounded-xl"
                                placeholder="engineering@company.com"
                            />
                            <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-wider text-xs">
                                Subscribe <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-zinc-600">Zero spam. Only precision content. Unsubscribe anytime.</p>
                    </div>
                    {/* Subtle glow */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
                </div>
            </div>
        </BlogLayout>
    );
}
