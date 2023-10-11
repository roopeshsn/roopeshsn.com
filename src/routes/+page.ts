import fetchBytes from "../utils/fetchBytes"

export async function load({ params }: { params: { slug: string } }) {
  const res = await fetchBytes()
 
  return {
    res
  }
}

