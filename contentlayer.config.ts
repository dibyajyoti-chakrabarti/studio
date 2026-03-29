import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    summary: { type: 'string', required: true },
    image: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    author: { type: 'string', default: 'MechHub Team' },
    authorImage: { type: 'string' },
    published: { type: 'boolean', default: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath.replace(/^posts\//, '')}`,
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace(/^posts\//, ''),
    },
    readingTime: {
      type: 'json',
      resolve: (doc) => readingTime(doc.body.raw),
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          onVisitLine(node: any) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
