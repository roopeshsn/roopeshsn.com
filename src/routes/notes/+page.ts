import fetchNotes from "../../utils/fetchNotes"

export async function load({ params }: { params: { slug: string } }) {
  const res = await fetchNotes()
  return {
    res
  }
}