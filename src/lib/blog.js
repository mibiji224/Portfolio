export const postPath = (post) => `/blog/${encodeURIComponent(post.slug || post.id)}`
