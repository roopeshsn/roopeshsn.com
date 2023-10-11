/**
 * Paginates an array of data.
 *
 * @param {any[]} data
 * @param {{ page?: number, limit: number }} args
 * @returns
 */
function paginate(data: any[], { page = 1, limit } = {}) {
    if (limit) {
      return data.slice((page - 1) * limit, page * limit)
    }
  
    return data
}

export default paginate