'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Clock, Calendar, ArrowRight, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Post } from 'contentlayer/generated';

interface BlogCardProps {
    post: Post;
    index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
    return (
        <Link
            href={post.url}
            className="group block relative"
        >
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-500 hover:border-blue-500/30 hover:bg-white/[0.04] hover:shadow-[0_12px_30px_rgba(59,130,246,0.08)]">
                {/* Image Container */}
                <div className="relative aspect-[2/1] overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {post.tags?.slice(0, 2).map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                    <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5 text-cyan-400" />
                            {format(parseISO(post.date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-cyan-400" />
                            {post.readingTime.text}
                        </span>
                    </div>

                    <h3 className="text-base font-bold font-heading text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {post.summary}
                    </p>

                    <div className="pt-2.5 flex items-center justify-between border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-[8px] font-bold text-white uppercase ring-1 ring-white/10">
                                {post.author.charAt(0)}
                            </div>
                            <span className="text-[11px] font-medium text-zinc-400">{post.author}</span>
                        </div>

                        <div className="flex items-center gap-1 font-bold text-[10px] text-blue-400 uppercase tracking-wider group-hover:gap-1.5 transition-all">
                            Read
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
