type Byte = {
    meta: Record<string, any>,
    path: string
}

const sortDate = (a: Byte, b: Byte): number => {
    return new Date(b.meta.createdAt) - new Date(a.meta.createdAt)
}

export default sortDate