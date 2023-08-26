type meta = {
    title: string,
    createdAt: string,
    summary: string,
    tags: Array<string>,
    author: string,
    content: string,
}

type byte = {
    meta: meta,
    path: string
}

export const sortDate = (a: byte, b: byte): number => {
    return new Date(b.meta.createdAt) - new Date(a.meta.createdAt)
}