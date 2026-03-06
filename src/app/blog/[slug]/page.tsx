import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { allPosts } from 'contentlayer/generated';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Mdx } from '@/components/MDXComponents';
import { ShareButtons } from '@/components/ShareButtons';
import { TableOfContents } from '@/components/TableOfContents';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogEngagement } from '@/components/BlogEngagement';
import { BlogComments } from '@/components/BlogComments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return allPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PostPageProps) {
    const { slug } = await params;
    const post = allPosts.find((post) => post.slug === slug);

    if (!post) return {};

    const ogUrl = new URL('https://www.mechhub.in/api/og');
    ogUrl.searchParams.set('title', post.title);
    ogUrl.searchParams.set('author', post.author);

    return {
        title: `${post.title} | MechHub Blog`,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: [ogUrl.toString()],
        },
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = allPosts.find((post) => post.slug === slug);

    if (!post) {
        notFound();
    }

    // Related posts (share at least one tag)
    const relatedPosts = allPosts
        .filter((p) => p.slug !== post.slug && p.tags?.some((t) => post.tags?.includes(t)))
        .slice(0, 3);

    return (
        <BlogLayout>
            <article className="max-w-screen-xl mx-auto">
                {/* Navigation */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white mb-12 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </Link>

                {/* Hero Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                            {post.tags?.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="bg-blue-500/5 border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-left font-libre font-bold tracking-tight text-balance text-2xl md:text-3xl lg:text-3xl text-white mb-8">
                            {post.title}
                        </h1>

                        <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                            {post.summary}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-white uppercase ring-2 ring-white/5">
                                    {post.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{post.author}</p>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Author</p>
                                </div>
                            </div>

                            <Separator orientation="vertical" className="h-8 bg-white/10 hidden md:block" />

                            <div className="flex items-center gap-6">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                                        {format(parseISO(post.date), 'MMMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                        {post.readingTime.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
                    </div>
                </div>

                {/* Article Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 items-start">
                    {/* Main Content */}
                    <div className="max-w-3xl">
                        <Mdx code={post.body.code} />

                        {/* Share & Actions */}
                        <ShareButtons title={post.title} summary={post.summary} slug={post.slug} />

                        {/* Engagement (Likes) & Comments */}
                        <BlogEngagement slug={post.slug} />
                        <BlogComments slug={post.slug} />
                    </div>

                    {/* Sidebar */}
                    <aside className="sticky top-32 space-y-12 hidden lg:block">
                        {/* Table of Contents */}
                        <TableOfContents />

                        {/* Newsletter */}
                        <NewsletterSignup />
                    </aside>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-32 pt-16 border-t border-white/5 space-y-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold font-heading text-white">Keep Reading</h2>
                                <p className="text-zinc-500 text-sm">More technical insights from our MechMasters.</p>
                            </div>
                            <Link href="/blog">
                                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider text-xs gap-2">
                                    View All Posts <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((p) => (
                                <Link key={p.slug} href={`/blog/${p.slug}`} className="group space-y-4">
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                        <Image src={p.image} alt={p.title} fill className="object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                    <h4 className="font-bold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {p.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </BlogLayout>
    );
}
