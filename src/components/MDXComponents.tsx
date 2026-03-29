'use client';

import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { cn } from '@/utils';

const components = {
    h1: ({ className, ...props }: any) => (
        <h1
            className={cn(
                'mt-12 text-left font-libre tracking-wide text-balance leading-tight text-3xl md:text-4xl lg:text-5xl text-[#1E3A66] mb-8',
                className
            )}
            {...props}
        />
    ),
    h2: ({ className, ...props }: any) => (
        <h2
            className={cn(
                'mt-12 text-left font-libre font-bold tracking-wide text-balance leading-tight text-2xl md:text-3xl text-[#1E3A66] mb-6',
                className
            )}
            {...props}
        />
    ),
    h3: ({ className, ...props }: any) => (
        <h3
            className={cn(
                'mt-10 scroll-m-20 font-libre text-xl md:text-2xl font-semibold tracking-normal leading-snug text-[#1E3A66] mb-4',
                className
            )}
            {...props}
        />
    ),
    h4: ({ className, ...props }: any) => (
        <h4
            className={cn(
                'mt-8 scroll-m-20 font-libre text-lg md:text-xl font-semibold tracking-normal leading-snug text-[#1E3A66] mb-4',
                className
            )}
            {...props}
        />
    ),
    p: ({ className, ...props }: any) => (
        <p
            className={cn('leading-loose [&:not(:first-child)]:mt-8 text-slate-600', className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }: any) => (
        <ul className={cn('my-8 ml-6 list-disc space-y-3 text-slate-600 leading-relaxed', className)} {...props} />
    ),
    ol: ({ className, ...props }: any) => (
        <ol className={cn('my-8 ml-6 list-decimal space-y-3 text-slate-600 leading-relaxed', className)} {...props} />
    ),
    li: ({ className, ...props }: any) => (
        <li className={cn('mt-2 text-slate-600', className)} {...props} />
    ),
    blockquote: ({ className, ...props }: any) => (
        <blockquote
            className={cn(
                'mt-6 border-l-2 border-[#2F5FA7] pl-6 italic text-slate-600 font-medium bg-[#2F5FA7]/5 py-4 pr-4 rounded-r-lg',
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
        <img className={cn('rounded-xl border border-slate-200 my-8', className)} alt={alt} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-10 border-slate-200" {...props} />,
    pre: ({ className, ...props }: any) => (
        <pre
            className={cn(
                'mb-4 mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 py-6 px-4 backdrop-blur-sm',
                className
            )}
            {...props}
        />
    ),
    code: ({ className, ...props }: any) => (
        <code
            className={cn(
                'relative rounded bg-[#2F5FA7]/10 px-[0.3rem] py-[0.1rem] font-mono text-sm text-[#2F5FA7]',
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
        <div className="mdx prose max-w-none text-slate-600">
            <Component components={components} />
        </div>
    );
}
