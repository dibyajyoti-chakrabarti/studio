'use client';

import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { cn } from '@/lib/utils';

const components = {
    h1: ({ className, ...props }: any) => (
        <h1
            className={cn(
                'mt-8 scroll-m-20 font-heading text-4xl font-bold tracking-tight text-white',
                className
            )}
            {...props}
        />
    ),
    h2: ({ className, ...props }: any) => (
        <h2
            className={cn(
                'mt-10 scroll-m-20 border-b border-white/10 pb-2 font-heading text-3xl font-semibold tracking-tight text-white first:mt-0',
                className
            )}
            {...props}
        />
    ),
    h3: ({ className, ...props }: any) => (
        <h3
            className={cn(
                'mt-8 scroll-m-20 font-heading text-2xl font-semibold tracking-tight text-zinc-100',
                className
            )}
            {...props}
        />
    ),
    h4: ({ className, ...props }: any) => (
        <h4
            className={cn(
                'mt-8 scroll-m-20 font-heading text-xl font-semibold tracking-tight text-zinc-200',
                className
            )}
            {...props}
        />
    ),
    p: ({ className, ...props }: any) => (
        <p
            className={cn('leading-7 [&:not(:first-child)]:mt-6 text-zinc-400', className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }: any) => (
        <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2 text-zinc-400', className)} {...props} />
    ),
    ol: ({ className, ...props }: any) => (
        <ol className={cn('my-6 ml-6 list-decimal [&>li]:mt-2 text-zinc-400', className)} {...props} />
    ),
    li: ({ className, ...props }: any) => (
        <li className={cn('mt-2', className)} {...props} />
    ),
    blockquote: ({ className, ...props }: any) => (
        <blockquote
            className={cn(
                'mt-6 border-l-2 border-blue-500 pl-6 italic text-zinc-300 font-medium bg-blue-500/5 py-4 pr-4 rounded-r-lg',
                className
            )}
            {...props}
        />
    ),
    img: ({
        className,
        alt,
        ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={cn('rounded-xl border border-white/10 my-8', className)} alt={alt} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-10 border-white/10" {...props} />,
    pre: ({ className, ...props }: any) => (
        <pre
            className={cn(
                'mb-4 mt-8 overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/50 py-6 px-4 backdrop-blur-sm',
                className
            )}
            {...props}
        />
    ),
    code: ({ className, ...props }: any) => (
        <code
            className={cn(
                'relative rounded bg-zinc-800/80 px-[0.3rem] py-[0.1rem] font-mono text-sm text-zinc-200',
                className
            )}
            {...props}
        />
    ),
};

interface MdxProps {
    code: string;
}

export function Mdx({ code }: MdxProps) {
    const Component = useMDXComponent(code);

    return (
        <div className="mdx prose prose-invert max-w-none">
            <Component components={components} />
        </div>
    );
}
